var CardDeck = require('./carddeck').CardDeck;
var Rank = require('./carddeck').Rank;
var Suite = require('./carddeck').Suite;
var Card = require('./carddeck').Card;
var PlayerCollection = require('./player').PlayerCollection;
var Status = require('./player').Status;
var readline = require("readline");
var Log = require("./log").Log;

function Table(tableId) {
    this.tableId = tableId;
    this.roundId = 0;
    this.tableActive = true;

    this.log = new Log();

    this.deck = new CardDeck();
    this.flop = [];
    this.turn = null;
    this.river = null;

    this.revealFlop = false;
    this.revealTurn = false;
    this.revealRiver = false;
    this.revealOtherPlayers = false;

    this.players = new PlayerCollection();

    this.pot = 0;
    this.maxBet = 0;
    this.bigBlindAmount = 0;
    this.smallBlindAmount = 0;
    this.bigBlind = -1;
    this.smallBlind = -1;

    this.main = function () {
        while (this.tableActive) {
            this.waitForPlayers();
            this.playGame();
        }
    };

    this.waitForPlayers = function () {
        this.log(this.tableId, this.roundId, "Waiting for players");
        this.players.addWaitingPlayers();
        while (this.players.getNumberOfPlayers() < 2) {
            this.this.players.addWaitingPlayers();
        }
    };

    this.playGame = function () {
        this.setupTable();
        this.playBetRound();
        this.playFlopRound();
        this.playTurnRound();
        this.playRiverRound();
        this.determineWinner();
        this.cleanupTable();
    };

    this.setupTable = function () {
        this.log.logGame(this.tableId, this.roundId, "Shuffling Deck");
        this.roundId++;
        this.deck.shuffle();


        this.log.logGame(this.tableId, this.roundId, "Setting players to active");
        this.players.setActive();


        // Deal Cards
        this.log.logGame(tableId, roundId, "Dealing cards");
        this.flop = this.deck.deck.splice(0, 3);
        this.turn = this.deck.deck.pop();
        this.river = this.deck.deck.pop();
        for (var i = 0; i < this.players.getNumberOfPlayers(Status.ACTIVE, true); i++) {
            this.players.getPlayerAt(i).cardA = this.deck.deck.pop();
            this.players.getPlayerAt(i).cardB = this.deck.deck.pop();
        }
    };

    this.playBetRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {

            // Determine Blinds
            this.bigBlind = this.players.getNextPlayerIndex(this.bigBlind, Status.ACTIVE, true, false, true);
            this.smallBlind = this.players.getNextPlayerIndex(this.bigBlind, Status.ACTIVE, true, false, true);

            // Charge Blinds
            this.players.getPlayerAt(this.smallBlind).user.balance -= this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).user.balance -= this.bigBlindAmount;

            // Add Blind amount to users' bets
            this.players.getPlayerAt(this.smallBlind).bets += this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).bets += this.bigBlindAmount;

            // Add Blind amount to the pot
            this.pot += this.smallBlindAmount;
            this.pot += this.bigBlindAmount;

            this.notifyPlayers();
            this.conductBets();
        }
    };

    this.playFlopRound = function () {
        this.revealFlop = true;
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.notifyPlayers();
            this.conductBets();
        }
    };

    this.playTurnRound = function () {
        this.revealTurn = true;
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.notifyPlayers();
            this.conductBets();
        }
    };

    this.playRiverRound = function () {
        this.revealRiver = true;
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.notifyPlayers();
            this.conductBets();
        }
    };

    this.determineWinner = function () {
        this.revealOtherPlayers = true;

        this.notifyPlayers();
    };

    this.cleanupTable = function () {
        // Remove cards and place them back in the deck
        this.deck.deck.push(this.flop.pop());
        this.deck.deck.push(this.flop.pop());
        this.deck.deck.push(this.flop.pop());
        this.deck.deck.push(this.turn);
        this.deck.deck.push(this.river);
        this.turn = null;
        this.river = null;

        // Set all reveal variables to false
        this.revealFlop = false;
        this.revealTurn = false;
        this.revealRiver = false;
        this.revealOtherPlayers = false;

        // Reset Bets and Pots
        this.pot = 0;
        this.currentBet = 0;

        // Add Player Hands back
        for (var i = 0; i < this.players.getNumberOfPlayers(); i++) {
            this.deck.deck.push(this.players.getPlayerAt(i).handA);
            this.deck.deck.push(this.players.getPlayerAt(i).handB);
        }
    };

    this.conductBets = function () {

        var currentPlayer = this.players.getNextPlayerIndex(0, Status.ALL, true, true, true);
        var lastPlayer = this.players.getNextPlayerIndex(0, Status.ALL, true, false, false);

        while (currentPlayer !== lastPlayer) {
            if (this.players.getPlayerAt(currentPlayer).status === Status.ACTIVE) {
                var input = this.getUserInput();
                var player = this.players.getPlayerAt(currentPlayer);

                if (input.name === "CHECK") {
                    if (player.bets < this.maxBet) {
                        this.log.logGameError(this.tableId, this.roundId, player.user.name + " has CHECKED");
                        // TODO - Handle and notify user of an error condition
                    } else {
                        this.log.logGame(this.tableId, this.roundId, player.user.name + " has CHECKED");
                        // TODO - Log and proceed to next player
                    }

                } else if (input.name === "FOLD") {
                    player.status = Status.FOLDED;
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " has FOLDED");
                    // TODO - Log and proceed to the next player

                } else if (input.name === "LEAVE") {
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " has LEFT the game");
                    // TODO - Go through this.players to remove player

                } else if (input.name === "CALL") {
                    if (player.bets + player.user.balance < this.maxBet) {
                        // TODO - Log error condition and force player to fold
                    } else {
                        player.user.balance -= (this.maxBet - player.bets);
                        var callAmount = (this.maxBet - player.bets);
                        player.bets += callAmount;
                        this.log.logGame(this.tableId, this.roundId, player.user.name + " has CALLED for " + callAmount);
                    }
                    // TODO - Log and move to next player

                } else if (input.name === "RAISE") {
                    if ((input.amount + this.maxBet) <= player.user.balance) {
                        player.user.balance -= input.amount;
                        player.bets += input.amount;
                        this.pot += input.amount;
                        this.maxBet += input.amount;
                        lastPlayer = currentPlayer;
                        this.log.logGame(this.tableId, this.roundId, player.user.name + " has RAISED by " + input.amount);
                        //
                    } else {
                        // TODO - Invalid command received - Handle and notify the user of an error condition
                    }

                } else if (input.name === "TIMEOUT") {
                    // TODO - Log, notify user, and exit
                } else {

                }

            }
        }

    };

    this.notifyPlayers = function() {
        console.log("Flop Cards: " + this.flop);
        console.log("Turn Card: " + this.turn);
        console.log("River Card: " + this.river);
        console.log("Pot: " + this.pot);
    };

    this.notifyPlayer = function(index) {

    };

    this.getUserInput = function() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        var command;
        var amount;

        rl.question('User command: ', (answer) => {
            command = answer;
        });

        if (command === 'RAISE') {
            rl.question('User amount: ', (answer) => {
                amount = answer;
            });
        }
        rl.close();

        return {
            'name': command,
            'amount': amount
        };
    };
}

module.exports = {
    Table : Table
};
