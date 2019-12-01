var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require("path");
var messages = require('../server/messages');
var defines = require('../server/definition');
var Suites = require('../server/carddeck').Suites;
var Ranks = require('../server/carddeck').Ranks;
var helmet = require("helmet");
var bodyParser = require("body-parser");

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function(req, res){
  res.sendFile(path.resolve("web/table.html"));
});

app.get('/table.js', function(req, res){
  res.sendFile(path.resolve("web/src/table.js"));
});

app.get('/main.css', function(req, res){
  res.sendFile(path.resolve("web/style/main.css"));
});

io.on('connection', function(socket){
  var currentPlayer = new messages.CurrentPlayerMessageComponent("Harry", 1776, 252, 0, defines.Status.ACTIVE.toString(),
      defines.Actions.CALL.toString(),
      new messages.CardComponent(Suites.DIAMONDS, Ranks.KING), new messages.CardComponent(Suites.HEARTS, Ranks.SEVEN), false, false);

  var tableStatus = new messages.TableMessageComponent(750, 250, 4, defines.Rounds.FLOP.toString(),
      new messages.CardComponent(Suites.CLUBS, Ranks.TEN), new messages.CardComponent(Suites.DIAMONDS, Ranks.NINE),
      new messages.CardComponent(Suites.HEARTS, Ranks.EIGHT), new messages.CardComponent(Suites.SPADES, Ranks.SEVEN),
      new messages.CardComponent("", ""));

  var player0cardA = new messages.CardComponent(Suites.DIAMONDS, Ranks.TWO);
  var player0cardB = new messages.CardComponent(Suites.CLUBS, Ranks.ACE);

  var player1cardA = new messages.CardComponent(Suites.HEARTS, Ranks.THREE);
  var player1cardB = new messages.CardComponent(Suites.SPADES, Ranks.KING);

  var player2cardA = new messages.CardComponent(Suites.DIAMONDS, Ranks.FOUR);
  var player2cardB = new messages.CardComponent(Suites.CLUBS, Ranks.QUEEN);

  var player3cardA = new messages.CardComponent(Suites.HEARTS, Ranks.FIVE);
  var player3cardB = new messages.CardComponent(Suites.SPADES, Ranks.JACK);

  var player4cardA = new messages.CardComponent(Suites.DIAMONDS, Ranks.SIX);
  var player4cardB = new messages.CardComponent(Suites.SPADES, Ranks.TEN);

  var player5cardA = new messages.CardComponent("", "");
  var player5cardB = new messages.CardComponent("", "");

  var player0 = new messages.OtherPlayerMessageComponent("Player0", 0, 1000, 100, defines.Status.ACTIVE, defines.Actions.CHECK, player0cardA, player0cardB, false, false);

  var player1 = new messages.OtherPlayerMessageComponent("Player1", 0, 2000, 200, defines.Status.ACTIVE, defines.Actions.CHECK, player1cardA, player1cardB, false, false);

  var player2 = new messages.OtherPlayerMessageComponent("Player2", 0, 3000, 300, defines.Status.ACTIVE, defines.Actions.CHECK, player2cardA, player2cardB, false, false);

  var player3 = new messages.OtherPlayerMessageComponent("Player3", 0, 4000, 400, defines.Status.ACTIVE, defines.Actions.CHECK, player3cardA, player3cardB, false, false);

  var player4 = new messages.OtherPlayerMessageComponent("Player4", 0, 5000, 500, defines.Status.ACTIVE, defines.Actions.CHECK, player4cardA, player4cardB, false, false);

  var player5 = new messages.OtherPlayerMessageComponent("Player5", 0, 6000, 600, defines.Status.ACTIVE, defines.Actions.CHECK, player5cardA, player5cardB, false, false);

  var playerArr = [];
  playerArr.push(player0);
  playerArr.push(player1);
  playerArr.push(player2);
  playerArr.push(player3);
  playerArr.push(player4);
  playerArr.push(player5);

  var msg = new messages.GameStatusMessage(currentPlayer, playerArr, tableStatus);
  io.sockets.emit("game-status-message", msg);

  var msg2 = new messages.GetUserActionMessage([defines.Actions.CHECK, defines.Actions.RAISE, defines.Actions.CALL, defines.Actions.ALLIN], 100, 300, 200, 30);
  io.sockets.emit("get-user-action-message", msg2);

  io.sockets.on("user-action-msg", function (msg) {
    console.log(msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
