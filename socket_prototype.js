var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require("path");

app.get('/', function(req, res){
  console.log("GET");
  res.sendFile(path.resolve("web/table.html"));
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log("GET");
  console.log('listening on *:3000');
});