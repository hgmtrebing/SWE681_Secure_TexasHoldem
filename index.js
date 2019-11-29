const https = require("https");
const fs = require("fs");
const express = require("express");
var bodyParser = require("body-parser");
let middleware = require('./middleware');
const userRoute = require('./routes/api/user');
const helmet = require('helmet');
const Log = require('./server/log.js').Log;
const socket = require('socket.io');


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
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", 'code.jquery.com', 'stackpath.bootstrapcdn.com', 'cdnjs.cloudflare.com'],
//       styleSrc: ["'self'", 'stackpath.bootstrapcdn.com'],
//       fontSrc: ["'self'", 'stackpath.bootstrapcdn.com']
//     }
//    }));
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
    res.sendFile("web/home.html", { root: __dirname});
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

app.get("/home.js", function (req, res) {
    res.sendFile("web/src/home.js", { root: __dirname });
});

// Route for user login and register
app.use("/api/user", userRoute);



//Error Handler


/*********************************   ROUTING  ******************************************************/

var server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);




server.listen(8080, function () {
    log.logSystem("HTTPS Server is now listening on port 8080");
});

//socket setup:
let io = socket(server);
io.on('connection', function(socket){
    log.logSystem("Made socket Connection by a user! " + socket.id);
    socket.on('check', function(value){
        io.sockets.emit('check', value);
    })
});



