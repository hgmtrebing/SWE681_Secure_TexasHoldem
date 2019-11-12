const https = require("https");
const fs = require("fs");
const express = require("express");
var bodyParser = require("body-parser");
let middleware = require('./middleware');
let userservice = require('./server/userService')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO - this sends an error message to the browser if there is an error - we must suppress this behavior
app.get('/', function(req, res) {
    res.sendFile("web/welcome.html", {root: __dirname});
});

app.get("/login", function(req, res) {
    console.log("request received");
    res.sendFile("web/login.html", {root: __dirname});
});

app.get("/create-account", function(req, res){
    console.log("request received");
    res.sendFile("web/new_user.html", {root: __dirname});
});

app.post("/new-user", function (req, res) {
    //console.log(JSON.stringify(req.body));
    res.send('register');
});

app.post("/login", function(req, res){
  result = userservice.authenticate(req.body.username, req.body.password);
  result.then((result) => res.send(result));
});

app.get("/newUserAjax.js", function (req, res) {
    res.sendFile("web/src/newUserAjax.js", {root: __dirname});
});

var server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);

server.listen(8080, function() {
    console.log("HTTPS Server is now listening on port 8080");
});
