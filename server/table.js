var CardDeck = require('./carddeck').CardDeck;
var Rank = require('./carddeck').Rank;
var Suite = require('./carddeck').Suite;
var Card = require('./carddeck').Card;
var readline = require("readline");

function Table(tableId) {
    this.tableId = tableId;
    this.roundId = 0;
    this.deck = new CardDeck();
    this.players = [];
    this.flop = [];
    this.turn = null;
    this.river = null;
    this.playersToAdd = [];
    this.playersToRemove = [];
    this.pot = 0;
    this.currentBet = 0;
    this.bigBlindAmount = 0;
    this.smallBlindAmount = 0;
    this.bigBlind = 0;
    this.smallBlind = 0;

    this.main = function() {

        this.roundId++;
        this.deck.shuffle();

        // Determine Blinds
        this.bigBlind++;
        this.smallBlind++;
        if (this.smallBlind >= this.players.length) {
            this.smallBlind = 0;
        }
        if (this.bigBlind >= this.players.length) {
            this.bigBlind = 0;
        }

        // Charge Blinds
        this.players[this.smallBlind].balance -= this.smallBlindAmount;
        this.players[this.bigBlind].balance -= this.bigBlindAmount;
        this.pot += this.smallBlindAmount;
        this.pot += this.bigBlindAmount;

        // Deal Cards
        this.flop = this.deck.deck.splice(0, 3);
        this.turn = this.deck.deck.pop();
        this.river = this.deck.deck.pop();
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].cardA = this.deck.deck.pop();
            this.players[i].cardB = this.deck.deck.pop();
        }

        var lastPlayer = 0;

    };

    this.computeLastPlayer = function(currentPlayerIndex) {
        if (currentPlayerIndex === 0) {
            return this.players.length - 1;
        } else {
            return currentPlayerIndex-1;
        }
    };
    
    this.playRound = function () {
        var currentPlayer = 0;
        var lastPlayer = this.computeLastPlayer(currentPlayer);

        while (currentPlayer !== lastPlayer) {
            var action = this.receiveUserAction();

            if (action.name === "CHECK") {

            } else if (action.name === "FOLD") {
                this.players[currentPlayer].status = "FOLDED";
            } else if (action.name === "LEAVE") {

            } else if (action.name === "CALL") {

            } else if (action.name === "RAISE") {

            } else {

            }

            currentPlayer++;
        }
    }

    this.receivePlayerAction = function () {
        this.testReceive();
    }

    this.testReceive = function() {

    }
}

module.exports = {
    Table : Table
};


