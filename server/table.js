const CardDeck = require('./carddeck').CardDeck;
const PlayerCollection = require('./player').PlayerCollection;
const Status = require('./definition').Status;
const Rounds = require('./definition').Rounds;
const Actions = require('./definition').Actions;
const Log = require("./log").Log;
const GameStatusMessage = require("./messages").GameStatusMessage;
const UserActionMessage = require("./messages").UserActionMessage;
const GetUserActionMessage = require("./messages").GetUserActionMessage;
const TableMessageComponent = require("./messages").TableMessageComponent;
const CurrentPlayerMessageComponent = require("./messages").CurrentPlayerMessageComponent;
const OtherPlayerMessageComponent = require("./messages").OtherPlayerMessageComponent;

function Table(tableId) {
    this.tableId = tableId;
    this.roundId = 0;

    this.log = new Log();

    this.deck = new CardDeck();
    this.flop = [];
    this.turn = null;
    this.river = null;

    this.round = null;

    this.players = new PlayerCollection();

    this.pot = 0;
    this.maxCurrentRoundBet = 0;
    this.bigBlindAmount = 0;
    this.smallBlindAmount = 0;
    this.bigBlind = -1;
    this.smallBlind = -1;

    this.lastPlayer = 0;
    this.currentPlayer = 0;

    /**
     * The main loop for the table. As long as the Table is not inactive, this method will wait for a sufficient number
     * of players and start a new game.
     */
    this.main = function () {
        while (this.round !== Rounds.INACTIVE) {
            this.waitForPlayers();
            this.playGame();
        }
    };

    /**
     * As long as the number of players is less than two, this method will wait for more players, adding them as they
     * appear.
     */
    this.waitForPlayers = function () {
        this.log.logGame(this.tableId, this.roundId, "Waiting for players");
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
        this.round = Rounds.SETUP;
        this.log.logGame(this.tableId, this.roundId, "Shuffling Deck");
        this.roundId++;
        this.deck.shuffle();


        this.log.logGame(this.tableId, this.roundId, "Setting players to active");
        this.players.setActive();


        // Deal Cards
        this.log.logGame(this.tableId, this.roundId, "Dealing cards");
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
            this.round = Rounds.BET;

            // Determine Blinds
            this.bigBlind = this.players.getNextPlayerIndex(this.bigBlind, Status.ACTIVE, true, false, true);
            this.smallBlind = this.players.getNextPlayerIndex(this.bigBlind, Status.ACTIVE, true, false, true);

            // Charge Blinds
            this.players.getPlayerAt(this.smallBlind).user.balance -= this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).user.balance -= this.bigBlindAmount;

            // Add Blind amount to users' bets
            this.players.getPlayerAt(this.smallBlind).currentRoundBet += this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).currentRoundBet += this.bigBlindAmount;
            this.players.getPlayerAt(this.smallBlind).bets += this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).bets += this.bigBlindAmount;

            // Add Blind amount to the pot
            this.pot += this.smallBlindAmount;
            this.pot += this.bigBlindAmount;

            this.maxCurrentRoundBet = this.bigBlindAmount;
            this.conductBets(this.maxCurrentRoundBet);
        } else {
            this.round = Rounds.FINAL;
        }
    };

    this.playFlopRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.FLOP;
            this.conductBets(0);
        } else {
            this.round = Rounds.FINAL;
        }
    };

    this.playTurnRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.TURN;
            this.conductBets(0);
        } else {
            this.round = Rounds.FINAL;
        }
    };

    this.playRiverRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.RIVER;
            this.conductBets(0);
        } else {
            this.round = Rounds.FINAL;
        }
    };

    this.determineWinner = function () {
        this.round = Rounds.FINAL;

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

        // Reset Bets and Pots
        this.pot = 0;
        this.currentMaxCurrBet = 0;

        // Add Player Hands back
        for (var i = 0; i < this.players.getNumberOfPlayers(); i++) {
            this.deck.deck.push(this.players.getPlayerAt(i).handA);
            this.deck.deck.push(this.players.getPlayerAt(i).handB);
        }
    };

    this.conductBets = function (startingBet) {

        // Get the inital bet and setup
        this.maxCurrentRoundBet = startingBet;
        this.currentPlayer = this.players.getNextPlayerIndex(0, Status.ALL, true, true, true);
        this.conductIndividualBet(this.currentPlayer);
        this.lastPlayer = this.currentPlayer;
        this.currentPlayer = this.players.getNextPlayerIndex(this.currentPlayer, Status.ALL, true, false, true);

        // Get bets for remaining players
        while (this.currentPlayer !== this.lastPlayer) {
            this.conductIndividualBet(this.currentPlayer);
            this.currentPlayer = this.players.getNextPlayerIndex(this.currentPlayer, Status.ALL, true, false, true);
        }
        this.maxCurrentRoundBet = 0;

        // Reset current round bets for player
        for (var i = 0; i < this.players.getNumberOfPlayers(Status.ALL, true); i++) {
            var player = this.players.getPlayerAt(i);
            player.currentRoundBet = 0;
        }
    };

    this.conductIndividualBet = function(currentPlayer) {
        this.sendGameStateToPlayers();
        if (this.players.getPlayerAt(currentPlayer).status === Status.ACTIVE) {
            var player = this.players.getPlayerAt(currentPlayer);
            var checkable =  player.currentRoundBet >= this.maxCurrentRoundBet;
            var callable = player.currentRoundBet + player.user.balance >= this.maxCurrentRoundBet;
            var hasRemainingBalance = player.user.balance > 0;
            var input = player.receive();

            if (input.action === Actions.CHECK) {
                if (checkable) {
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " has CHECKED");
                } else {
                    this.log.logGameError(this.tableId, this.roundId, player.user.name + " has CHECKED, despite not meeting the bet amount");
                    player.status = Status.FOLDED;
                }

            } else if (input.action === Actions.FOLD) {
                player.status = Status.FOLDED;
                this.log.logGame(this.tableId, this.roundId, player.user.name + " has FOLDED");

            } else if (input.action === Actions.LEAVE) {
                this.log.logGame(this.tableId, this.roundId, player.user.name + " has LEFT the game");
                this.deck.deck.push (player.cardA);
                this.deck.deck.push (player.cardB);
                player.cardA = null;
                player.cardB = null;
                player.removeUser();

            } else if (input.action === Actions.CALL) {
                var callAmount = this.maxCurrentRoundBet - player.currentRoundBet;
                if(callable) {
                    player.user.balance -= (this.maxCurrentRoundBet - player.currentRoundBet);
                    player.bets += callAmount;
                    player.currentRoundBet += callAmount;
                    this.pot += callAmount;
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " has CALLED for " + callAmount);
                } else {
                    this.log.logGameError(this.tableId, this.roundId, "INVALID MOVE: " + player.user.name + " attempted to call for " +callAmount);
                    player.status = Status.FOLDED;
                }

            } else if (input.action === Actions.ALLIN) {
                if (hasRemainingBalance) {
                    player.bets += player.user.balance;
                    player.currentRoundBet += player.user.balance;
                    player.user.balance = 0;
                    player.status = Status.ALLIN;
                    if (player.currentRoundBet > this.maxCurrentRoundBet) {
                        this.maxCurrentRoundBet = player.currentRoundBet;
                    }
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " went ALL IN");
                } else {
                    this.log.logGameError(this.tableId, this.roundId, player.user.name + " attempted to go ALL IN, but lacked a remaining balance");
                }
            } else if (input.action === Actions.RAISE) {
                if ((input.betAmount + this.maxCurrentRoundBet) <= player.user.balance &&
                        input.betAmount + player.bets >= this.maxCurrentRoundBet) {
                    player.user.balance -= input.betAmount;
                    player.bets += input.betAmount;
                    player.currentRoundBet += input.betAmount;
                    this.pot += input.betAmount;
                    this.maxCurrentRoundBet = input.betAmount;
                    this.lastPlayer = this.currentPlayer;
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " has RAISED by " + input.betAmount);
                } else {
                    player.status = Status.FOLDED;
                    this.log.logGameError(this.tableId, this.roundId, player.user.name + " attempted to RAISE, but lacked sufficient funds and was forcibly folded")
                }

            } else if (input.action === Actions.TIMEOUT) {
                player.status = Status.FOLDED;
                this.log.logGame(this.tableId, this.roundId, player.user.name + " has TIMED OUT");
            } else {
                this.log.logGameError(this.tableId, this.roundId, player.user.name + " has provided an unrecognized action: " + input.action);
            }
        }
        this.sendGameStateToPlayers();
    };

    this.sendGameStateToPlayers = function() {
        var localFlop = null;
        var localTurn = null;
        var localRiver = null;
        if (this.round === Rounds.FLOP) {
            localFlop = this.flop;
        } else if (this.round === Rounds.TURN) {
            localFlop = this.flop;
            localTurn = this.turn;
        } else if (this.round === Rounds.RIVER) {
            localFlop = this.flop;
            localTurn = this.turn;
            localRiver = this.river;
        } else if (this.round === Rounds.FINAL) {
            localFlop = this.flop;
            localTurn = this.turn;
            localRiver = this.river;
        }
        var table = new TableMessageComponent(this.maxCurrentRoundBet, this.pot, this.round, localFlop, localTurn, localRiver);
        var otherUsers = [];
        for (let i = 0; i < this.players.getNumberOfPlayers(Status.ALL, true); i++) {
            let player = this.players.getPlayerAt(i);
            let playerComponent = new OtherPlayerMessageComponent(player.user.name, player.user.balance,
                player.maxCurrentRoundBet, player.status, this.bigBlind === i, this.smallBlind === i);
            otherUsers.push(playerComponent);
        }
        var message = new GameStatusMessage(otherUsers, table);
        for (let i = 0; i < this.players.getNumberOfPlayers(Status.ALL, true); i++) {
            this.players.getPlayerAt(i).send(message);
        }
    };

    this.toString = function() {
        var str = "";
        str += "Table ID: " + this.tableId +"\n";
        str += "Round ID: " + this.roundId + "\n";
        str += "Round: " + this.round + "\n\n";
        str += "Pot: " + this.pot + "\n";
        str += "Big Blind: " + this.bigBlind + "\n";
        str += "Small Blind: " + this.smallBlind + "\n\n";
        str += "Flop: " + this.flop + "\n";
        str += "Turn: " + this.turn.toString() + "\n";
        str += "River: " + this.river.toString() + "\n\n";
        str += this.players.toString() +"\n";
        return str;
    };
}

module.exports = {
    Table : Table
};
