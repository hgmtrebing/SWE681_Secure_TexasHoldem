var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require("path");
var messages = require('../server/messages');
var defines = require('../server/definition');
var Suites = require('../server/carddeck').Suites;
var Ranks = require('../server/carddeck').Ranks;

app.get('/', function(req, res){
  res.sendFile(path.resolve("web/table.html"));
});

app.get('/web/src/table.js', function(req, res){
  res.sendFile(path.resolve("web/src/table.js"));
});

app.get('/web/style/main.css', function(req, res){
  res.sendFile(path.resolve("web/style/main.css"));
});

io.on('connection', function(socket){
  console.log('a user connected');
  var currentPlayer = new messages.CurrentPlayerMessageComponent("Harry", 1776, 252, 0, defines.Status.ACTIVE.toString(),
      defines.Actions.CALL.toString(),
      new messages.CardComponent(Suites.DIAMONDS, Ranks.KING), new messages.CardComponent(Suites.HEARTS, Ranks.SEVEN), false, false);

  var tableStatus = new messages.TableMessageComponent(750, 250, 4, defines.Rounds.FLOP.toString(),
      new messages.CardComponent(Suites.CLUBS, Ranks.TEN), new messages.CardComponent(Suites.DIAMONDS, Ranks.NINE),
      new messages.CardComponent(Suites.HEARTS, Ranks.EIGHT), new messages.CardComponent(Suites.SPADES, Ranks.SEVEN),
      new messages.CardComponent("", ""));
  var playerArr = [];
  var msg = new messages.GameStatusMessage(currentPlayer, playerArr, tableStatus);
  io.sockets.emit("game-status-message", msg);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});