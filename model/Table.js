/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

const mongoose = require('mongoose');

let schema = mongoose.Schema;

let TableSchema = new schema({
    tableNumber:{
        type: Number,
        default:0, 
        required :[true, 'tableNumber is required'] 
    }
});

module.exports = mongoose.model('Table', TableSchema);
