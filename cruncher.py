import pandas as pd
import pickle
import time
import sys
from datetime import timedelta
from math import isnan

class StatCruncher:
    def __init__(self, df_path, roster, teamStats, setType):
        self._df = pd.read_csv(df_path, compression='gzip', dtype=setType)
        self._roster = roster
        self._teamStats = teamStats
        self._teams = list(self._teamStats['2017'].keys())
        self._date_filtered = None
        self._display = None
        self._playerCols = ['p1', 'p2', 'p3', 'p4', 'p5']
        self._onCourt = []
        self._offCourt = []
        self._showPlayers = []
        self._playerStats = {}
        self._seasonStartsEnds = {2014: ('20131029', '20140416'),
                                  2015: ('20141028', '20150415'),
                                  2016: ('20151027', '20160413'),
                                  2017: ('20161025', '20170412')}

    def findSeasonSpan(self, queryDateStart, queryDateEnd):
        """
        Find which seasons the queried dates cover
        """
        start, end = None, None
        for season in self._seasonStartsEnds.keys():
            season_starts, season_ends = [int(x) for x in self._seasonStartsEnds[season]]
            if season_starts <= int(queryDateStart) <= season_ends:
                start = season
            if season_starts <= int(queryDateEnd) <= season_ends:
                end = season

        # If invalid dates are queried, infer season from dates
        if not start:
            start = int(queryDateStart[:4]) + 1
        if not end:
            end = int(queryDateEnd[:4])

        seasonsQueried = [str(x) for x in list(range(start, end+1))]
        return seasonsQueried

    def makeQuery(self, state, onCourt):
        """
        Build string queries for filtering the data frame.
        """
        if not state :
            return None
        else:
            equiv = '==' if onCourt else '!='
            operator = '|' if onCourt else '&'
            query = ''
            numPlayers = len(state)
            i = 1
            for player in state:
                query += '('
                query += operator.join("({} {} '{}')".format\
                        (col, equiv, player) for col in self._playerCols) + ')&'
            return query[:-1]

    def filterPlayers(self):
        """
        Filter data frame according to on court and off court players
        """
        # Build string queries for on and off court players
        queryOn = self.makeQuery(self._onCourt, onCourt=True)
        queryOff = self.makeQuery(self._offCourt, onCourt=False)

        # Combine strings into one query and run
        if queryOn and queryOff:
            query = '{} & {}'.format(queryOn, queryOff)
            self._df = self._df.query(query)

        elif not queryOn and queryOff:
            query = '{}'.format(queryOff)
            self._df = self._df.query(query)

        elif queryOn and not queryOff:
            query = '{}'.format(queryOn)
            self._df = self._df.query(query)

    def filterDate(self, date1, date2, season):
        """
        Filter data frame by date range
        """
        # If user does not specify date range or bounds, default to regular season
        if not date1 and not date2:
            date1, date2 = self._seasonStartsEnds[season]
        elif date1 and not date2:
            date2 = self._seasonStartsEnds[season][1]
        elif date2 and not date1:
            date1 = self._seasonStartsEnds[season][0]

        # Query the main DF and save date-filtered DF for later
        queryDates = '{} <= Date <= {}'.format(date1, date2)
        self._df = self._df.query(queryDates)
        self._date_filtered = self._df.query(queryDates)

    def filterCourt(self, court):
        """
        Filter data frame by home or away
        """
        self._df = self._df[self._df['Court'] == court]

    def filterOpponent(self, stat, operator, value, seasons):
        """
        Filter dataframe on games where opponent meets criteria
        """
        filterSeasons = {}
        for season in seasons:
            filterTeams = []
            for team in self._teams:
                if operator == '>':
                    if self._teamStats[season][team][stat] > value:
                        filterTeams.append(team)
                elif operator == '<':
                    if self._teamStats[season][team][stat] < value:
                        filterTeams.append(team)
                filterSeasons[season] = filterTeams

        # Filter team's data according to season where stat is valid
        first = True
        for season in seasons:
            start, end = self._seasonStartsEnds[int(season)]
            if first:
                res = self._df[(self._df['Opponent'].isin(filterTeams))]
                res = res.query('{} <= Date <= {}'.format(start, end))
                first = False
            else:
                tmp = self._df[(self._df['Opponent'].isin(filterTeams))]
                tmp = tmp.query('{} <= Date <= {}'.format(start, end))
                res = pd.concat([res, tmp])
        self._df = res

    def onAdd(self, players):
        """
        User adds player(s) to 'on court' designation
        """
        self._onCourt = players
        for player in players:
            self._roster.remove(player)     # So that on-court player does not display twice

    def offAdd(self, players):
        """
        User adds player(s) to 'off court' designation
        """
        self._offCourt = players
        for player in players:
            self._roster.remove(player)     # So that off-court player does not display

    def showingPlayers(self):
        """
        Make a list of players to display according to on/off court queries
        """
        self._showPlayers = self._onCourt + self._roster

    def rawNumbers(self):
        actions = ['2pt', '3pt', 'BLK', 'DREB', 'OREB', 'TREB', 'FGA', 'FGM', 'FTA', 'FTM', 'TOV', 'assist', 'steal']
        self._playerStats = {x:{} for x in self._showPlayers}
        for player in self._showPlayers:
            self._df['mp_{}'.format(player)] = pd.to_timedelta(self._df['mp_{}'.format(player)])
            seconds = self._df['mp_{}'.format(player)].sum().total_seconds()
            m, s = divmod(seconds, 60)
            minutes = m + (s*.1)
            self._playerStats[player].update({'min': minutes})
            for action in actions:
                total = self._df['{}_{}'.format(action, player)].sum()
                if isnan(total):
                    total = 0
                self._playerStats[player].update({action: total})

    def cruncher(self):
        """
        Calculate stat categories for relevant players
        Output json dataframe for AngularJS comsumption
        """
        # Make list of players that will be displayed
        self.showingPlayers()

        # Build players' stat dictionaries
        self.rawNumbers()

        # Initialized output data frame
        cols = ['Player', 'dkFPPM', 'fdFPPM', 'usg', 'fusg', 'minutes'] # add other stat categories as they get worked on
        self._display = pd.DataFrame(columns=cols)

        # # Store team stats according to date range
        tFGA = self._date_filtered['tFGA'].sum()
        tFTA = self._date_filtered['tFTA'].sum()
        tREB = self._date_filtered['tREB'].sum()
        tTOV = self._date_filtered['tTOV'].sum()
        numGames = len(set(self._date_filtered.Date))

        # Store player stats for following calculations
        for player in self._showPlayers:
            min_ = self._playerStats[player]['min']
            pts = self._playerStats[player]['2pt'] * 2 + \
                 (self._playerStats[player]['3pt'] * 3) + \
                  self._playerStats[player]['FTM']
            pt3 = self._playerStats[player]['3pt']
            rbs = self._playerStats[player]['TREB']
            stl = self._playerStats[player]['steal']
            ast = self._playerStats[player]['assist']
            blk = self._playerStats[player]['BLK']
            tov = self._playerStats[player]['TOV']
            fga = self._playerStats[player]['FGA']
            fta = self._playerStats[player]['FTA']

            # Only display players that play
            if min_ != 0 and not isnan(min_):
                # Fan point per minute
                totalFP_fd = pts + (rbs * 1.2) + (ast * 1.5) + \
                            (blk * 2) + (stl * 2) + (tov * -1)

                totalFP_dk = pts + (rbs * 1.25) + (pt3 * 0.5) + \
                            (ast * 1.5) + (blk * 2) + (stl * 2) + (tov * -0.5) # Not using DD or TD

                totalFPPM_fd = round(totalFP_fd / min_, 2)
                totalFPPM_dk = round(totalFP_dk / min_, 2)

                # Usage rate
                usg = round(100 * ((fga + (0.44 * fta) + tov) *48.0*numGames)/       (min_ * (tFGA + (0.44 * tFTA) + tTOV)), 2)

                fusg = round(100 * ((fga + (0.44 * fta) ) * 48.0*numGames) /
                            (min_ * (tFGA + (0.44 * tFTA) )), 2)

                self._display = self._display.append(pd.DataFrame([[player, totalFPPM_dk, totalFPPM_fd, usg, fusg, round(min_)]], columns=cols))
                self._display.sort_values(by='minutes', ascending=False, inplace=True)

        self._display = self._display.reset_index(drop=True)
        return self._display.to_json()

def crunch(team, onPlayers=[], offPlayers=[], startDate=None, endDate=None, season=2017, court=None, oppStats=None, playoffs=False):
    start = time.time()

    # Use smaller files for faster computation
    if int(startDate) > 20160619:
        path = './data/play-by-play/2017/'
    else:
        path = './data/play-by-play/16-17/'

    file_ = team + '.csv.gz'

    # Load data
    with open('./data/teamStatsMaster.pkl', 'rb') as f1:
        teamStats = pickle.load(f1)

    with open('./data/rosters/2017/{}'.format(team), 'rb') as f2:
        roster = pickle.load(f2)

    # Specify dtype for mixed-type cols to save resources
    dtypeFix = {}
    for player in roster:
        dtypeFix['mp_{}'.format(player)] = 'object'

    # Initialize StatCrucher object
    stats = StatCruncher(df_path=path+file_, roster=roster, teamStats=teamStats, setType=dtypeFix)

    # Filter data frame if queries exist and run method to return html table
    if onPlayers:
        stats.onAdd(onPlayers)
    if offPlayers:
        stats.offAdd(offPlayers)
    if court:
        stats.filterCourt(court)

    stats.filterDate(date1=startDate, date2=endDate, season=season)

    # Opponent stats queries
    if oppStats:
        seasonSpan = stats.findSeasonSpan(queryDateStart=startDate, queryDateEnd=endDate)
        stat, operator, value = oppStats
        stats.filterOpponent(stat.lower(), operator, float(value), seasonSpan)

    if onPlayers or offPlayers:
        stats.filterPlayers()

    res = stats.cruncher()

    end = time.time() - start
    print("{}s".format(format(end, '0.3f')))

    return res

if __name__ == "__main__":
    # Use this area for testing
    crunch(team='HOU', onPlayers=['James Harden'], offPlayers=['Dwight Howard'],
            startDate='20141030', endDate='20170425', oppStats=[('pace', '>', 95)])

