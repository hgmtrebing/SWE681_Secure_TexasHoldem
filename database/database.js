/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

//NOTE: not being used right now
let mongoose = require('mongoose');
const config = require('../config');
const Log = require('../server/log.js').Log;

mongoose.connect(config.DBURL, { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

let log = new Log();

/// CONNECTION EVENTS
// When mongodb successfully connected
mongoose.connection.on('connected', function () {
  log.logSystem('Mongoose connection is now open to ' + config.DBURL);
});

// If the mongodb connection throws an error
mongoose.connection.on('error', function (err) {
  log.logSystemError('Mongoose connection has error: ' + err);
});

// When the mongodb connection is disconnected
mongoose.connection.on('disconnected', function () {
  log.logSystem('Mongoose connection is now disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
      log.logSystem('Mongoose connection is now disconnected: app closed');
      process.exit(0);
  });
});
