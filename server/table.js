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
            this.players.getPlayerAt(this.smallBlind).bets += this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).bets += this.bigBlindAmount;

            // Add Blind amount to the pot
            this.pot += this.smallBlindAmount;
            this.pot += this.bigBlindAmount;

            this.conductBets();
        } else {
            this.round = Rounds.FINAL;
        }
    };

    this.playFlopRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.FLOP;
            this.conductBets();
        } else {
            this.round = Rounds.FINAL;
        }
    };

    this.playTurnRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.TURN;
            this.conductBets();
        } else {
            this.round = Rounds.FINAL;
        }
    };

    this.playRiverRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.RIVER;
            this.conductBets();
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

    this.conductBets = function () {

        var currentPlayer = this.players.getNextPlayerIndex(0, Status.ALL, true, true, true);
        var lastPlayer = this.players.getNextPlayerIndex(0, Status.ALL, true, false, false);
        this.maxCurrentRoundBet = 0;

        while (currentPlayer !== lastPlayer) {
            this.sendGameStateToPlayers();
            this.conductIndividualBet(currentPlayer);
            currentPlayer = this.players.getNextPlayerIndex(currentPlayer, Status.ACTIVE, true, false, true);
            this.sendGameStateToPlayers();
        }
        this.maxCurrentRoundBet = 0;
    };

    this.conductIndividualBet = function(currentPlayer) {
        if (this.players.getPlayerAt(currentPlayer).status === Status.ACTIVE) {
            var player = this.players.getPlayerAt(currentPlayer);
            var checkable =  player.currentRoundBet >= this.maxCurrentRoundBet;
            var callable = player.currentRoundBet + player.balance >= this.maxCurrentRoundBet;
            var hasRemainingBalance = player.balance > 0;
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
                if(callable) {
                    player.user.balance -= (this.maxCurrentRoundBet - player.currentRoundBet);
                    var callAmount = (this.maxCurrentRoundBet - player.currentRoundBet);
                    player.bets += callAmount;
                    player.currentRoundBet += callAmount;
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " has CALLED for " + callAmount);
                } else {
                    this.log.logGameError(this.tableId, this.roundId, "INVALID MOVE: " + player.user.name + " attempted to call when they did not have enough money");
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
                }
            } else if (input.action === Actions.RAISE) {
                if ((input.betAmount + this.maxBet) <= player.user.balance) {
                    player.user.balance -= input.betAmount;
                    player.bets += input.betAmount;
                    this.pot += input.betAmount;
                    this.maxBet += input.amount;
                    lastPlayer = currentPlayer;
                    this.log.logGame(this.tableId, this.roundId, player.user.name + " has RAISED by " + input.amount);
                } else {
                    player.status = Status.FOLDED
                }

            } else if (input.action === Actions.TIMEOUT) {
                player.status = Status.FOLDED;
                this.log.logGame(this.tableId, this.roundId, player.user.name + " has TIMED OUT");
            } else {
                this.log.logGameError(this.tableId, this.roundId, player.user.name + " has provided an unrecognized action: " + input.action);
            }
        }
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
    }
}

module.exports = {
    Table : Table
};
