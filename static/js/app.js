'use strict';
var app = angular.module('App', ['ui.bootstrap', 'ngAnimate', 'ngSanitize',
                                'angularjs-dropdown-multiselect',
                                'ui.grid', 'angular-loading-bar'])

// Uncomment this to remove loading spinner
// .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
//  cfpLoadingBarProvider.includeSpinner = false; }]);

app.controller('AppController', ['$scope', '$http',
    function($scope, $http) {
    // Team selector
    $scope.teams = [
        { title: 'select a team', abbr: 'None' },
        { title: 'Atlanta Hawks', abbr: 'ATL'},
        { title: 'Brooklyn Nets', abbr: 'BKN'},
        { title: 'Boston Celtics', abbr: 'BOS'},
        { title: 'Charlotte Hornets', abbr: 'CHA'},
        { title: 'Chicago Bulls', abbr: 'CHI'},
        { title: 'Cleveland Cavaliers', abbr: 'CLE'},
        { title: 'Dallas Mavericks', abbr: 'DAL'},
        { title: 'Denver Nuggets', abbr: 'DEN'},
        { title: 'Detroit Pistons', abbr: 'DET'},
        { title: 'Golden State Warriors', abbr: 'GSW'},
        { title: 'Houston Rockets', abbr: 'HOU'},
        { title: 'Indiana Pacers', abbr: 'IND'},
        { title: 'Los Angeles Clippers', abbr: 'LAC'},
        { title: 'Los Angeles Lakers', abbr: 'LAL'},
        { title: 'Memphis Grizzlies', abbr: 'MEM'},
        { title: 'Miami Heat', abbr: 'MIA'},
        { title: 'Milwaukee Bucks', abbr: 'MIL'},
        { title: 'Minnesota Timberwolves', abbr: 'MIN'},
        { title: 'New Orleans Pelicans', abbr: 'NOP'},
        { title: 'New York Knicks', abbr: 'NYK'},
        { title: 'Oklahoma City Thunder', abbr: 'OKC'},
        { title: 'Orlando Magic', abbr: 'ORL'},
        { title: 'Philadelphia 76ers', abbr: 'PHI'},
        { title: 'Phoenix Suns', abbr: 'PHX'},
        { title: 'Portland Trail Blazers', abbr: 'POR'},
        { title: 'Sacramento Kings', abbr: 'SAC'},
        { title: 'San Antonio Spurs', abbr: 'SAS'},
        { title: 'Toronto Raptors', abbr: 'TOR'},
        { title: 'Utah Jazz', abbr: 'UTA'},
        { title: 'Washington Wizards', abbr: 'WAS'},
        ];

     // Players
    $scope.players =
    {'HOU': ['James Harden', 'Trevor Ariza', 'Clint Capela',
            'Sam Dekker', 'Patrick Beverley', 'Lou Williams',
            'Montrezl Harrell', 'Ryan Anderson', 'Eric Gordon',
            'Nene', 'Chinanu Onuaku', 'Kyle Wiltjer', 'Bobby Brown',
            'Isaiah Taylor', 'Troy Williams'],

    'UTA': ['Shelvin Mack', 'Rudy Gobert', 'George Hill',
            'Boris Diaw', 'Derrick Favors', 'Gordon Hayward',
            'Alec Burks', 'Dante Exum', 'Rodney Hood', 'Trey Lyles',
            'Joe Ingles', 'Raul Neto', 'Jeff Withey', 'Joe Johnson',
            'Joel Bolomboy'],

    'BOS': ['Avery Bradley', 'Kelly Olynyk', 'Isaiah Thomas',
            'Marcus Smart', 'James Young', 'Terry Rozier',
            'Jae Crowder', 'Jonas Jerebko', 'Amir Johnson',
            'Jordan Mickey', 'Al Horford', 'Jaylen Brown',
            'Demetrius Jackson', 'Gerald Green', 'Tyler Zeller'],

    'TOR': ['Lucas Nogueira', 'Serge Ibaka', 'P.J. Tucker',
            'Patrick Patterson', 'Kyle Lowry', 'Jonas Valanciunas',
            'Bruno Caboclo', 'Delon Wright', 'DeMarre Carroll',
            'Cory Joseph', 'Norman Powell', 'DeMar DeRozan',
            'Jakob Poeltl', 'Pascal Siakam', 'Fred VanVleet'],

    'PHX': ['Eric Bledsoe', 'Alex Len', 'T.J. Warren',
            'Devin Booker', 'Tyson Chandler', 'Brandon Knight',
            'Alan Williams', 'Jared Dudley', 'Dragan Bender',
            'Leandro Barbosa', 'Marquese Chriss', 'Tyler Ulis',
            'Derrick Jones', 'Ronnie Price', 'Jarell Eddie'],

    'ORL': ['Jodie Meeks', 'Terrence Ross', 'C.J. Wilcox', 'Aaron Gordon',
            'Elfrid Payton', 'Mario Hezonja', 'C.J. Watson', 'Nikola Vucevic',
            'Bismack Biyombo', 'Jeff Green', 'D.J. Augustin', 'Evan Fournier',
            'Stephen Zimmerman', 'Damjan Rudez'],

    'CHI': ['Nikola Mirotic', 'Michael Carter-Williams',
            'Anthony Morrow', 'Joffrey Lauvergne', 'Cameron Payne',
            'Jerian Grant', 'Bobby Portis', 'Jimmy Butler',
            'Robin Lopez', 'Cristiano Felicio', 'Rajon Rondo',
            'Dwyane Wade', 'Denzel Valentine', 'Paul Zipser',
            'Isaiah Canaan'],

    'PHI': ['Tiago Splitter', 'Nik Stauskas', 'Joel Embiid',
            'Robert Covington', 'Jahlil Okafor', 'Justin Anderson',
            'Richaun Holmes', 'T.J. McConnell', 'Gerald Henderson',
            'Ben Simmons', 'Timothe Luwawu-Cabarrot', 'Sergio Rodriguez',
            'Dario Saric', 'Jerryd Bayless', 'Shawn Long'],

    'DET': ['Kentavious Caldwell-Pope', 'Reggie Bullock',
            'Marcus Morris', 'Stanley Johnson', 'Aron Baynes',
            'Tobias Harris', 'Reggie Jackson', 'Darrun Hilliard',
            'Jon Leuer', 'Ish Smith', 'Andre Drummond', 'Boban Marjanovic',
            'Michael Gbinije', 'Henry Ellenson', 'Beno Udrih'],

    'SAS': ['Tony Parker', 'Patty Mills', 'Kyle Anderson',
            'Kawhi Leonard', 'Danny Green', 'LaMarcus Aldridge',
            'Jonathon Simmons', 'Pau Gasol', 'Manu Ginobili',
            'Dewayne Dedmon', 'Dejounte Murray', 'Bryn Forbes',
            'Davis Bertans', 'David Lee', 'Joel Anthony'],

    'DEN': ['Mason Plumlee', 'Danilo Gallinari', 'Wilson Chandler',
            'Kenneth Faried', 'Gary Harris', 'Emmanuel Mudiay',
            'Jameer Nelson', 'Nikola Jokic', 'Will Barton',
            'Roy Hibbert', 'Darrell Arthur', 'Malik Beasley',
            'Mike Miller', 'Jamal Murray', 'Juan Hernangomez'],

    'LAL': ['Nick Young', 'Tyler Ennis', 'Julius Randle',
            "D'Angelo Russell", 'Larry Nance Jr.', 'Corey Brewer',
            'Luol Deng', 'Timofey Mozgov', 'Ivica Zubac',
            'Jordan Clarkson', 'Tarik Black', 'Brandon Ingram',
            'Thomas Robinson', 'Metta World Peace', 'David Nwaba'],

    'IND': ['C.J. Miles', 'Paul George', 'Jeff Teague',
            'Myles Turner', 'Thaddeus Young', 'Monta Ellis',
            'Lavoy Allen', 'Glenn Robinson III', 'Rakeem Christmas',
            'Joe Young', 'Al Jefferson', 'Georges Niang', 'Aaron Brooks',
            'Kevin Seraphin', 'Lance Stephenson'],

    'MIL': ['Tony Snell', 'John Henson', 'Giannis Antetokounmpo',
            'Spencer Hawes', 'Jabari Parker', 'Rashad Vaughn',
            'Khris Middleton', 'Greg Monroe', 'Michael Beasley',
            'Mirza Teletovic', 'Matthew Dellavedova', 'Thon Maker',
            'Malcolm Brogdon', 'Jason Terry', 'Terrence Jones'],

    'MEM': ['Vince Carter', 'Zach Randolph', 'Marc Gasol',
            'Tony Allen', 'JaMychal Green', 'Jarell Martin',
            'Brandan Wright', 'Chandler Parsons', 'Andrew Harrison',
            'Mike Conley', 'Troy Daniels', 'James Ennis', 'Wade Baldwin',
            'Deyonta Davis', 'Wayne Selden'],

    'NYK': ['Derrick Rose', 'Carmelo Anthony', 'Kristaps Porzingis',
            "Kyle O'Quinn", 'Justin Holiday', 'Mindaugas Kuzminskas',
            'Marshall Plumlee', 'Joakim Noah', 'Courtney Lee',
            'Lance Thomas', 'Sasha Vujacic', 'Maurice Ndour',
            'Willy Hernangomez', 'Ron Baker', 'Chasson Randle'],

    'GSW': ['Stephen Curry', 'Klay Thompson', 'Andre Iguodala',
            'Shaun Livingston', 'Kevon Looney', 'Draymond Green',
            'Kevin Durant', 'David West', 'Patrick McCaw', 'Zaza Pachulia',
            'Damian Jones', 'James Michael McAdoo', 'Ian Clark',
            'JaVale McGee', 'Matt Barnes'],

    'SAC': ['Ben McLemore', 'Rudy Gay', 'Tyreke Evans',
            'Darren Collison', 'Willie Cauley-Stein', 'Kosta Koufos',
            'Arron Afflalo', 'Garrett Temple', 'Anthony Tolliver',
            'Georgios Papagiannis', 'Malachi Richardson', 'Skal Labissiere',
            'Langston Galloway', 'Buddy Hield', 'Ty Lawson'],

    'WAS': ['Trey Burke', 'Marcin Gortat', 'Markieff Morris',
            'John Wall', 'Otto Porter', 'Bojan Bogdanovic',
            'Kelly Oubre Jr.', 'Ian Mahinmi', 'Jason Smith',
            'Daniel Ochefu', 'Tomas Satoransky', 'Bradley Beal',
            'Sheldon McClellan', 'Brandon Jennings'],

    'MIA': ['Chris Bosh', 'Josh McRoberts', 'Justise Winslow',
            'Goran Dragic', 'Luke Babbitt', 'Josh Richardson',
            'Tyler Johnson', 'Hassan Whiteside', 'Wayne Ellington',
            'Udonis Haslem', 'James Johnson', 'Willie Reed',
            'Rodney McGruder', 'Dion Waiters', 'Okaro White'],

    'NOP': ['Quincy Pondexter', 'Anthony Davis', 'Jrue Holiday',
            'DeMarcus Cousins', 'Alexis Ajinca', 'Omer Asik',
            'Dante Cunningham', "E'Twaun Moore", 'Tim Frazier',
            'Cheick Diallo', 'Solomon Hill', 'Donatas Motiejunas',
            'Quinn Cook', 'Jordan Crawford'],

    'ATL': ['Dennis Schroder', 'Ersan Ilyasova', 'Tim Hardaway',
            'Thabo Sefolosha', 'Mike Muscala', 'Mike Dunleavy',
            'Paul Millsap', 'Kent Bazemore', 'Dwight Howard',
            'Malcolm Delaney', 'Taurean Prince', 'DeAndre Bembry',
            'Kris Humphries', 'Ryan Kelly', 'Jose Calderon'],

    'POR': ['Damian Lillard', 'C.J. McCollum', 'Shabazz Napier',
            'Noah Vonleh', 'Jusuf Nurkic', 'Al-Farouq Aminu',
            'Ed Davis', 'Pat Connaughton', 'Evan Turner',
            'Allen Crabbe', 'Jake Layman', 'Meyers Leonard',
            'Festus Ezeli', 'Maurice Harkless', 'Tim Quarterman'],

    'OKC': ['Taj Gibson', 'Andre Roberson', 'Russell Westbrook',
            'Nick Collison', 'Steven Adams', 'Victor Oladipo',
            'Doug McDermott', 'Jerami Grant', 'Kyle Singler',
            'Enes Kanter', 'Josh Huestis', 'Alex Abrines',
            'Domantas Sabonis', 'Semaj Christon', 'Norris Cole'],

    'CLE': ['Kyrie Irving', 'Channing Frye', 'Kyle Korver',
            'Kevin Love', 'Iman Shumpert', 'Tristan Thompson',
            'Richard Jefferson', 'DeAndre Liggins', 'James Jones',
            'Kay Felder', 'LeBron James', 'J.R. Smith',
            'Deron Williams', 'Derrick Williams', 'Larry Sanders'],

    'DAL': ['Nerlens Noel', 'Devin Harris', 'Wesley Matthews',
            'J.J. Barea', 'Salah Mejri', 'Harrison Barnes',
            'Dwight Powell', 'A.J. Hammons', 'Dorian Finney-Smith',
            'Nicolas Brussino', 'Dirk Nowitzki', 'Seth Curry',
            'Yogi Ferrell', 'Jarrod Uthoff'],

    'LAC': ['Blake Griffin', 'J.J. Redick', 'Chris Paul',
            'Paul Pierce', 'DeAndre Jordan', 'Austin Rivers',
            'Wesley Johnson', 'Luc Mbah a Moute', 'Jamal Crawford',
            'Marreese Speights', 'Brice Johnson', 'Diamond Stone',
            'Raymond Felton', 'Brandon Bass', 'Alan Anderson'],

    'MIN': ['Ricky Rubio', 'Shabazz Muhammad', 'Gorgui Dieng',
            'Nikola Pekovic', 'Andrew Wiggins', 'Zach LaVine',
            'Adreian Payne', 'Karl-Anthony Towns', 'Tyus Jones',
            'Nemanja Bjelica', 'Cole Aldrich', 'Kris Dunn',
            'Brandon Rush', 'Jordan Hill', 'Lance Stephenson',
            'Omri Casspi'],

    'BKN': ['Rondae Hollis-Jefferson', 'Chris McCullough',
            'Brook Lopez', 'K.J. McDaniels', 'Sean Kilpatrick',
            'Jeremy Lin', 'Trevor Booker', 'Andrew Nicholson',
            'Isaiah Whitehead', 'Justin Hamilton', 'Randy Foye',
            'Caris LeVert', 'Joe Harris', 'Spencer Dinwiddie',
            'Quincy Acy', 'Archie Goodwin'],

    'CHA': ['Michael Kidd-Gilchrist', 'Kemba Walker',
            'Cody Zeller', 'Jeremy Lamb', 'Frank Kaminsky',
            'Marco Belinelli', 'Nicolas Batum', 'Ramon Sessions',
            'Marvin Williams', 'Brian Roberts', 'Christian Wood',
            'Treveon Graham', 'Miles Plumlee', "Johnny O'Bryant",
            'Briante Weber']
    };

    // Initialize variables
    $scope.firstSelection = true;
    $scope.selectedTeam = $scope.teams[0];
    $scope.submitState = true;
    $scope.gridState = false;
    $scope.progressState = false;
    $scope.progressTracker = 0;

    // Date Picker
    $scope.fromDate = new Date(2016, 9, 25);
    $scope.toDate = new Date();
    $scope.popup1 = { opened: false };
    $scope.popup2 = { opened: false };
    $scope.dateOptions = {
        minDate: new Date(2015, 9, 27),
        maxDate: new Date(),
        dateFormat: 'yy-mm-dd'
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    // Player selectors
    $scope.resetCourt = function() {
    $scope.teamRoster = [];
    $scope.onRoster = [];
    $scope.offRoster = [];
    $scope.onCourt = [];
    $scope.offCourt = [];
    $scope.dupes = []
    $scope.onChanged = false;
    $scope.offChanged = false;
    }

    $scope.resetCourt()

    $scope.playersExtraOptions = {
        enableSearch: true,
        scrollable: true,
        scrollableHeight: '300px',
        showCheckAll: false,
    };

    // Remove on-court and off-court duplicates
    $scope.preventDupes = function() {
        var allPlayers = $scope.teamRoster.map(function (x){ return x.id} );
        var onSelection = $scope.onCourt.map(function (x) {return x.id} );
        var offSelection = $scope.offCourt.map(function (x) {return x.id} );

        if ($scope.onChanged) {
            $scope.onChanged = false;
            var offUpdate = _.difference(allPlayers, onSelection);
            $scope.offRoster = offUpdate.map(function (x) {
                return {id: x, label: x}
            });
        };

        if ($scope.offChanged) {
            $scope.offChanged = false;
            var onUpdate = _.difference(allPlayers, offSelection);
            $scope.onRoster = onUpdate.map(function (x) {
            return {id: x, label: x}
            });
        };
    };

    $scope.onEvents = {
        onSelectionChanged: function() {
            $scope.onChanged = true;
            $scope.preventDupes();
        }
    };

    $scope.offEvents = {
        onSelectionChanged: function() {
            $scope.offChanged = true;
            $scope.preventDupes();
        }
    };

    $scope.translationsOnPlayers = {
        buttonDefaultText: 'on-court',
        dynamicButtonTextSuffix: ' players on-court'
    };
    $scope.translationsOffPlayers = {
        buttonDefaultText: 'off-court',
        dynamicButtonTextSuffix: ' players off-court'
    };

    // Trigger events when a new team is selected
    $scope.selectTeam = function(team) {
        $scope.selectedTeam = team
        $scope.resetCourt()
        $scope.gridState = false;
        $scope.teamRoster = $scope.players[$scope.selectedTeam.abbr].map(function(x) {
          return {id: x, label: x};
        });
        $scope.onRoster = $scope.teamRoster
        $scope.offRoster = $scope.teamRoster
        if ($scope.firstSelection){
            $scope.firstSelection = false;
            $scope.submitState = false;
        };
      };

    // Opponent Stats
    $scope.oppStatOptions = [ { id: 'Pace'}, {id: 'Ortg'}, {id: 'Drtg'} ];
    $scope.oppOperatorOptions = [ { id: '>'}, {id: '='}, {id: '<'} ];

    $scope.oppStat = $scope.oppStatOptions[0];
    $scope.oppOperator = $scope.oppOperatorOptions[0];
    $scope.oppValue = null;

    $scope.oppSelect1 = function(option){
        $scope.oppStat = option
    }

    $scope.oppSelect2 = function(operator){
        $scope.oppOperator = operator
    }


    // Initialize resulsts grid
    $scope.df=[''];

    // Send data to Flask
    $scope.send = function() {
        // Prevent submit from being clicked more than once
        $scope.gridState = false;
        $scope.submitState = true;
        $scope.progressState = true;

        // Select team and player lists
        var team = $scope.selectedTeam.abbr;
        if ($scope.onCourt.length > 0) {
            var onPlayers = $scope.onCourt.map(function(x){ return x.id })
        };

        if ($scope.offCourt.length > 0){
            var offPlayers = $scope.offCourt.map(function(x){ return x.id })
        };

        // Format dates
        var fromDate = $scope.fromDate.getFullYear().toString() +
                    ((1 + $scope.fromDate.getMonth()) > 9 ?
                    (1 + $scope.fromDate.getMonth()).toString() :
                    '0' + (1 +$scope.fromDate.getMonth()).toString()) +
                    ($scope.fromDate.getDate() > 9 ?
                    $scope.fromDate.getDate().toString() :
                    '0' + $scope.fromDate.getDate().toString())

        var toDate = $scope.toDate.getFullYear().toString() +
                    ((1 + $scope.toDate.getMonth()) > 9 ?
                    (1 + $scope.toDate.getMonth()).toString() :
                    '0' + (1 +$scope.toDate.getMonth()).toString()) +
                    ($scope.toDate.getDate() > 9 ?
                    $scope.toDate.getDate().toString() :
                    '0' + $scope.toDate.getDate().toString())


        // Pass Opponent Stats in a list
        if ($scope.oppValue != null){
            var oppStats = [$scope.oppStat.id, $scope.oppOperator.id, $scope.oppValue];
        }
        else {
            var oppStats = [];
        }

        // Post data to Flask
        $scope.df = [];
        var data = [team, onPlayers, offPlayers, fromDate, toDate, oppStats];
        $http.post('/cruncher/', data)

            // Update grid
            .then(function(res){
                $scope.progressState = false;
                var j = 0;
                for (var i in res.data.Player) {
                    $scope.df.push({
                        'Player': res.data.Player[i],
                        'fppm-dk': res.data.dkFPPM[i],
                        'fppm-fd': res.data.fdFPPM[i],
                        'usg%': res.data.usg[i],
                        'fusg%': res.data.fusg[i],
                        'total minutes': res.data.minutes[i]
                    });
                    i++
                }
            })
            .finally(function() {
                $scope.submitState = false;
                $scope.gridState = true;
            })
        };

}]);

// .config(function($interpolateProvider) {
//     $interpolateProvider.startSymbol('//').endSymbol('//');
//     });


