const https = require("https");
const http = require("http");
const fs = require("fs");
const express = require("express");

var app = express();

app.get('/', function(req, res) {
    res.send("hello world");
})

var server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);

app.listen(3000, function() {
    console.log("LISTENING UNSECURE");
});

server.listen(8080, function() {
    console.log("TEST");
});
