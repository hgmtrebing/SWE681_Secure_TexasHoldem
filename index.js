const https = require("https");
const http = require("http");
const fs = require("fs");
const express = require("express");

var app = express();

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

var server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);

server.listen(8080, function() {
    console.log("HTTPS Server is now listening on port 8080");
});
