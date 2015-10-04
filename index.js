var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var app = express();

var mongoUri = "mongodb://GameLunch:gamelunch@ds031571.mongolab.com:31571/heroku_app33048517"
var MatchData = require('./MatchData_model.js');

mongoose.connect(mongoUri);

app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended:false}));
app.use(express.static(path.join(__dirname,'/')));

app.post('/submitWinLoss',function(req,res){
    var gameName = req.body.GameName;
    var winner = req.body.Winner;
    var loser = req.body.Loser;
    var listOfLosers = loser.toString().split(",");

    console.log("Game Name: " + gameName);
    console.log("Winner: " + winner);
    console.log("List of losers: " + listOfLosers);
    
    mongoose.createConnection(mongoUri, function(err, res){
        if(err){
            console.error('Error connecting: ' + err);
        } else {
            var matchData = new MatchData({ "GameName" : gameName, 
                                           "Winner" : winner,
                                           "Loser" : listOfLosers});
            matchData.save(function(err, matchData){
                if(err){
                    return console.error(err);
                }
                console.log(matchData);
            });
        }
    });
    
});


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});