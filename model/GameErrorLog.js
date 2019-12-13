/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

const mongoose = require('mongoose');

let schema = mongoose.Schema;

let GameErrorLoggerSchema = new schema({
    Created_date: {
        type: Date,
        default: Date.now
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
    message: {
        type: String
    }
});

module.exports = mongoose.model('GameErrorLog', GameErrorLoggerSchema);
