var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var app = express();

var mongoUri = "mongodb://GameLunch:gamelunch@ds031571.mongolab.com:31571/heroku_app33048517";
var MatchData = require('./MatchData_model.js');

mongoose.connect(mongoUri);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, '/')));

app.get('/getGames', function(req, res) {
    MatchData.find().distinct("GameName", function(error, data) {
        console.log(data);
        res.send(data);
    });
});

app.post('/data', function(req, res) {
    var game = req.body.game;
    MatchData.find({
        "GameName": game
    }, function(err, data) {
        if (err) return console.error(err);
        res.send(data);
    });
});

app.post('/submitWinLoss', function(req, res) {
    var gameName = req.body.GameName;
    var winner = req.body.Winner;
    var loser = req.body.Loser;
    var listOfLosers = loser.toString().split(",");

    console.log("Game Name: " + gameName);
    console.log("Winner: " + winner);
    console.log("List of losers: " + listOfLosers);

    mongoose.createConnection(mongoUri, function(err, res) {
        if (err) {
            console.error('Error connecting: ' + err);
        }
        else {
            storeResults(winner, "win", gameName);
            for (var i = 0; i < listOfLosers.length; i++) {
                storeResults(listOfLosers[i], "loss", gameName);
            }
        }
    });
    res.send("success");

});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

function storeResults(player, result, game) {
    MatchData.find({
        "Player": player
    }).limit(1).count(function(err, data) {
        if (err) {
            console.error(err);
        }
        if (data < 1) {

            var matchData = new MatchData({
                "Player": player,
                "GameList": [{
                    "GameName": game,
                    "Outcome": result
                }]
            });

            matchData.save(function(err, result) {
                if (err) {
                    return console.error(err);
                }
                console.log(result);
            });
        }
        else {
            
            MatchData.find({
                "Player": player
            }, function(err, data) {

                if (err) {
                    return console.error(err);
                }
                var newGame = {
                    GameName: game,
                    Outcome: result
                };

                data[0].GameList.push(newGame);

                data[0].save(function(err, result) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(result)
                });
            });
        }
    });
}