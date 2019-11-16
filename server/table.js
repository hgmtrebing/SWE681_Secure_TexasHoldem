var CardDeck = require('carddeck').CardDeck;
var Rank = require('carddeck').Rank;
var Suite = require('carddeck').Suite;
var Card = require('carddeck').Card;

function Table(tableId) {
    this.tableId = tableId;
    this.roundId;
    this.deck = new CardDeck();
    this.users = [];
    this.bigBlindAmount = 0;
    this.smallBlindAmount = 0;
    this.bigBlind = 0;
    this.smallBlind = 0;
}

Table.prototype.main = function() {
    while (true) {

    }
}

/**
 * Plays a complete round of Texas Hold'Em
 */
Table.prototype.playRound = function() {
    this.setupTable();
    this.playBettingRound();
    this.playFlopRound();
    this.playTurnRound();
    this.playRiverRound();
    this.determineWinner();
    this.cleanupTable();
};

Table.prototype.setupTable = function() {
    this.deck.shuffle();
    this.determineBlinds();
};

Table.prototype.determineBlinds = function() {

};

module.exports = {
    Table : Table
};


