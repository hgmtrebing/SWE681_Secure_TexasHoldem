const mongoose = require('mongoose');

let schema = mongoose.Schema;

let GameLoggerSchema = new schema({
    Created_date: {
        type: Date,
        default: Date.now
      },
    UserId:{
        type:String,
        required :[true, 'Username is required']
    },
    username: {
        type: String, 
        required :[true, 'Username is required']
    },
    tableId:{
        type: Number, 
        required :[true, 'TableId is required'] 
    },
    roundId:{
        type: Number, 
        required :[true, 'RoundId is required'] 
    },
    move: {
        type: String
    }
});

module.exports = mongoose.model('GameLog', GameLoggerSchema);