var CardDeck = require('./carddeck').CardDeck;
var Rank = require('./carddeck').Rank;
var Suite = require('./carddeck').Suite;
var Card = require('./carddeck').Card;
var PlayerCollection = require('./player').PlayerCollection;
var Status = require('./player').Status();
var readline = require("readline");

function Table(tableId) {
    this.tableId = tableId;
    this.roundId = 0;
    this.tableActive = true;

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
    this.currentBet = 0;
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
        this.roundId++;
        this.deck.shuffle();

        this.players.setActive();

        // Determine Blinds
        this.bigBlind = this.players.getNextPlayerIndex(this.bigBlind, Status.ACTIVE, true);
        this.smallBlind = this.players.getNextPlayerIndex(this.bigBlind, Status.ACTIVE, true);

        // Charge Blinds
        this.players.getPlayerAt(this.smallBlind).balance -= this.smallBlindAmount;
        this.players.getPlayerAt(this.bigBlind).balance -= this.bigBlindAmount;
        this.pot += this.smallBlindAmount;
        this.pot += this.bigBlindAmount;

        // Deal Cards
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

        var currentPlayer = this.players.getNextPlayerIndex(0, Status.ACTIVE, true, true, true);
        var lastPlayer = this.players.getNextPlayerIndex(0, Status.ACTIVE, true, false, false);

        while (currentPlayer !== lastPlayer) {
            var input = this.getUserInput();

            if (input.name === "CHECK") {

            } else if (input.name === "FOLD") {
                this.players.getPlayerAt(currentPlayer).status = Status.FOLDED;
            } else if (input.name === "LEAVE") {

            } else if (input.name === "CALL") {

            } else if (input.name === "RAISE") {
                lastPlayer = currentPlayer;

            } else if (input.name === "TIMEOUT") {

            } else {

            }
        }
    };
}

module.exports = {
    Table : Table
};
