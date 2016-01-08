var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
                    Player: String,
                    GameList: [{
                        GameName: String,
                        Outcome: String
                    }]
                }, {collection: 'MatchData'});

module.exports = mongoose.model('MatchData', matchSchema);