import cruncher
import os

from flask import Flask, render_template, send_file, request
app = Flask(__name__)

@app.route('/')
def index():
    return send_file('templates/index.html')
    # return render_template('index.html')

@app.route('/cruncher/', methods=['GET', 'POST'])
def crunch():
    team, on, off, start, end, opp = request.get_json()
    res = cruncher.crunch(team=team, onPlayers=on, offPlayers=off,
                        startDate=start, endDate=end, oppStats=opp)
    return res

if __name__ == '__main__':
    app.run(debug=True)
    # port = int(os.environ.get("PORT", 5000))
    # app.run(host='0.0.0.0', port=port)
