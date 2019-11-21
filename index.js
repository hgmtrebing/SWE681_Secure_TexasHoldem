const https = require("https");
const fs = require("fs");
const express = require("express");
var bodyParser = require("body-parser");
let middleware = require('./middleware');
const mongoose = require('mongoose');
const config = require('./config.js');
const userRoute = require('./routes/api/user');
const helmet = require('helmet');
const socket = require('socket.io');

/************************************** DB CONNECT ******************************* */
// other option added due to deprication warnings.
mongoose.connect(config.DBURL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

// CONNECTION EVENTS
// When mongodb successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection is now open to ' + config.DBURL);
});

// If the mongodb connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection has error: ' + err);
});

// When the mongodb connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection is now disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose connection is now disconnected: app closed');
        process.exit(0);
    });
});

/************************************** DB CONNECT ******************************* */


var app = express();
app.use(helmet);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Note: we might have to have this routing in some other file
/*********************************   ROUTING  ******************************************************/
// TODO - this sends an error message to the browser if there is an error - we must suppress this behavior
app.get('/', function (req, res) {
    res.sendFile("web/welcome.html", { root: __dirname });
});

app.get('/game', function (req, res) {
    res.sendFile("web/game.html", { root: __dirname });
});

// example of passing middleware to verify token for each request.
app.get('/all-users', middleware.verifyToken, function (req, res) {
    res.send("Hello");
});

app.get("/login", function (req, res) {
    console.log("request received");
    res.sendFile("web/login.html", { root: __dirname });
});

app.get("/create-account", function (req, res) {
    console.log("request received");
    res.sendFile("web/new_user.html", { root: __dirname });
});

app.get("/newUserAjax.js", function (req, res) {
    res.sendFile("web/src/newUserAjax.js", { root: __dirname });
});

app.get("/login.js", function (req, res) {
    res.sendFile("web/src/loginAjax.js", { root: __dirname });
});

// Route for user login and register
app.use("/api/user", userRoute);

/*********************************   ROUTING  ******************************************************/

var server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);




server.listen(8080, function () {
    console.log("HTTPS Server is now listening on port 8080");
});

//socket setup:
let io = socket(server);
io.on('connection', function(socket){
    console.log("Made socket Connection by a user! " + socket.id);
    socket.on('check', function(value){
        io.sockets.emit('check', value);
    })
})



