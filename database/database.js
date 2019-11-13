
//NOTE: not being used right now

let mongoose = require('mongoose');
let dbUrl = "mongodb://localhost:27017/pokerDB";

mongoose.connect(dbUrl);

// CONNECTION EVENTS
// When mongodb successfully connected
mongoose.connection.on('connected', function () {  
    console.log('Mongoose connection is now open to ' + dbURI);
  }); 
  
  // If the mongodb connection throws an error
  mongoose.connection.on('error',function (err) {  
    console.log('Mongoose connection has error: ' + err);
  }); 
  
  // When the mongodb connection is disconnected
  mongoose.connection.on('disconnected', function () {  
    console.log('Mongoose connection is now disconnected'); 
  });

  // If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
      console.log('Mongoose connection is now disconnected: app closed'); 
      process.exit(0); 
    }); 
  }); 

