/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

const mongoose = require('mongoose');

let schema = mongoose.Schema;

let SystemLoggerSchema = new schema({
    type:{
        type: String,
        enum:["System", "Error"],
        default: "System"
    },
    Created_date: {
        type: Date,
        default: Date.now
      },
    message: {
        type: String
    }
});

module.exports = mongoose.model('SystemLog', SystemLoggerSchema);
