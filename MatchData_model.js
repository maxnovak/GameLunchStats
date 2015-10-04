var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
                    GameName: String,
                    Winner: String,
                    Loser: String
                }, {collection: 'MatchData'});

module.exports = mongoose.model('MatchData', matchSchema);