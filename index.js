/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const socket = require('socket.io');
const socketioJwt   = require('socketio-jwt');
const helmet = require('helmet');
const childProcess = require('child_process');
const GameServer = require('./server/game_server').GameServer;
const middleware = require('./middleware');
const userRoute = require('./routes/api/user');
const gameLogRoute = require('./routes/api/gamelog');
const Log = require('./server/log.js').Log;
const config = require("./config");


/************************************** Initialize Log ******************************* */
var log = new Log();

/************************************** DB CONNECT ******************************* */
const db = require('./database/database');
// // other option added due to deprication warnings.
// mongoose.connect(config.DBURL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

// // CONNECTION EVENTS
// // When mongodb successfully connected
// mongoose.connection.on('connected', function () {
//     log.logSystem('Mongoose connection is now open to ' + config.DBURL);
// });

// // If the mongodb connection throws an error
// mongoose.connection.on('error', function (err) {
//     log.logSystemError('Mongoose connection has error: ' + err);
// });

// // When the mongodb connection is disconnected
// mongoose.connection.on('disconnected', function () {
//     log.logSystem('Mongoose connection is now disconnected');
// });

// // If the Node process ends, close the Mongoose connection 
// process.on('SIGINT', function () {
//     mongoose.connection.close(function () {
//         log.logSystem('Mongoose connection is now disconnected: app closed');
//         process.exit(0);
//     });
// });

/************************************** DB CONNECT ******************************* */


var app = express();

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'localhost:8081'],
      scriptSrc: ["'self'", 'code.jquery.com', 'stackpath.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", 'stackpath.bootstrapcdn.com'],
      fontSrc: ["'self'", 'stackpath.bootstrapcdn.com'],
      connectSrc: ["'self'", 'https://localhost:8081/*']
    }
   }));
app.use(helmet.referrerPolicy({policy:'same-origin'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//Note: we might have to have this routing in some other file
/*********************************   ROUTING  ******************************************************/
// TODO - this sends an error message to the browser if there is an error - we must suppress this behavior
app.get('/', function (req, res) {
    res.sendFile("web/welcome.html", { root: __dirname });
});

app.get('/home', function (req, res) {
    res.sendFile("web/main.html", { root: __dirname });
});

// example of passing middleware to verify token for each request.
app.get('/all-users', middleware.verifyToken, function (req, res) {
    res.send("Hello");
});

app.get("/login", function (req, res) {
    log.logSystem("Login Request Received");
    res.sendFile("web/login.html", { root: __dirname});
});

app.get("/create-account", function (req, res) {
    log.logSystem("Create Account request received");
    res.sendFile("web/new_user.html", { root: __dirname });
});

app.get("/newUserAjax.js", function (req, res) {
    res.sendFile("web/src/newUserAjax.js", { root: __dirname });
});

app.get("/login.js", function (req, res) {
    res.sendFile("web/src/loginAjax.js", { root: __dirname });
});

app.get("/table.html", function(req, res) {
    res.sendFile("web/table.html", {root: __dirname});
});

app.get("/main.css", function(req, res){
    res.sendFile("web/style/main.css", {root: __dirname});
});

app.get("/table.js", function(req, res) {
    res.sendFile("web/src/table.js", {root: __dirname});
});

app.get("/home.js", function (req, res) {
    res.sendFile("web/src/home.js", { root: __dirname });
});

app.get("/welcome.js", function (req, res) {
    res.sendFile("web/src/welcome.js", { root: __dirname });
});

app.get("/socket.js", function (req, res) {
    res.sendFile("web/src/socket.js", { root: __dirname });
});

// Route for user login and register
app.use("/api/user", userRoute);
app.use("/api/gamelog", gameLogRoute);



//Error Handler



/*********************************   ROUTING  ******************************************************/

var server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);


/*********************************   GAME SERVER  ******************************************************/
const gameServer = new GameServer(server);
gameServer.start();



server.listen(8080, function () {
    log.logSystem("HTTPS Server is now listening on port 8080");
});



// //socket setup:
// let io = socket(server);
// //authorize on connection
// io.use(socketioJwt.authorize({
//     secret: config.secretKey,
//     handshake: true,
//     auth_header_required: true
//   }));

//   //static data
//   let store = [{
//       tableId: 1,
//       tableName: 'table#1',
//       players:1,
//       joinAllowed: true
//    },{
//     tableId: 2,
//     tableName: 'table#2',
//     players:5,
//     joinAllowed: false
//    },{
//     tableId: 3,
//     tableName: 'table#3',
//     players:3,
//     joinAllowed: true
//    }];

// io.on('connection', function(socket){
//     log.logSystem("Made socket Connection by a user! " + socket.id);
//     socket.emit("generalData",{
//         data:store
//     })

//     socket.on('disconnect', (reason) => {
//         console.log("Socket Disconnected: " + reason);
//       });

// });

