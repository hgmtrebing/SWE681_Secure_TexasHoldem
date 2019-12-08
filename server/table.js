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
const CardComponent = require('./messages').CardComponent;
const Rankings = require("./ranking").Rankings;
const rankHand = require("./ranking").rankHand;
const compareRankings = require("./ranking").compareRankings;

function Table(tableId, gameServer) {
    this.gameServer = gameServer;

    this.tableId = tableId;
    this.roundId = 0;

    this.log = new Log();

    this.deck = new CardDeck();
    this.flop = [];
    this.turn = null;
    this.river = null;

    this.round = Rounds.WAITING;

    this.players = new PlayerCollection(gameServer);

    this.pendingMessages = [];


    this.pot = 0;
    this.maxCurrentRoundBet = 0;
    this.bigBlindAmount = 0;
    this.smallBlindAmount = 0;
    this.bigBlind = -1;
    this.smallBlind = -1;

    this.lastPlayer = 0;
    this.currentPlayer = 0;
    this.winner = -1;
    this.waitingForInput = false;
    this.conductingBets = false;
    this.canAdvanceToNextRound = false;
    this.userTimeoutCounter = 0;
    this.userTimeoutFunction;

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

    this.addMessage = function(message) {
        this.pendingMessages.push(message);
    };

    this.processMessage = function() {
        // Process User Action Message
        while (this.pendingMessages.length > 0) {
            var message = this.pendingMessages.pop();
            var index = this.players.getPlayerIndexByUsername(message.username);
            if (index === this.currentPlayer) {
                this.players.getPlayerAt(this.currentPlayer).currentAction = { action: message.action, betAmount: parseInt(message.betAmount) };
                this.log.logSystem("Message received for user " + this.players.getPlayerAt(this.currentPlayer).user.username);
            } else {
                this.log.logSystemError("Message received for non-active user: " + message.username);
            }
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

    this.advanceToNextRound = function() {
        if (this.canAdvanceToNextRound) {
            this.log.logGame(this.tableId, this.roundId, "Ending Round " + this.round);
            if (this.round === Rounds.WAITING) {
                this.round = Rounds.SETUP;
            } else if (this.round === Rounds.SETUP) {
                this.round = Rounds.BET;
            } else if (this.round === Rounds.BET) {
                this.round = Rounds.FLOP;
            } else if (this.round === Rounds.FLOP) {
                this.round = Rounds.TURN;
            } else if (this.round === Rounds.TURN) {
                this.round = Rounds.RIVER;
            } else if (this.round === Rounds.RIVER) {
                this.round = Rounds.FINAL;
            } else if (this.round === Rounds.FINAL) {
                this.round = Rounds.CLEANUP;
            } else if (this.round === Rounds.CLEANUP) {
                this.round = Rounds.WAITING;
            } else {
                this.log.logGameError(this.tableId, this.roundId, "Invalid Round detected!");
            }
            this.log.logGame(this.tableId, this.roundId, "Starting Round " + this.round);
            this.canAdvanceToNextRound = false;
        }
    };

    this.sendGetUserAction = function() {
        var player = this.players.getPlayerAt(this.currentPlayer);
        var checkable =  player.currentRoundBet >= this.maxCurrentRoundBet;
        var callable = (player.currentRoundBet + player.user.balance) >= this.maxCurrentRoundBet;
        var raisable = (player.currentRoundBet + player.user.balance) > this.maxCurrentRoundBet;
        var hasRemainingBalance = player.user.balance > 0;
        var actions = [];

        if (player.status === Status.ACTIVE) {
            actions.push(Actions.FOLD);
            actions.push(Actions.LEAVE);
            if (raisable) {
                actions.push(Actions.RAISE);
            }

            if (checkable) {
                actions.push(Actions.CHECK);
            }

            if (callable) {
                actions.push(Actions.CALL);
            }

            if (hasRemainingBalance) {
                actions.push(Actions.ALLIN);
            }
        }
        var message = new GetUserActionMessage(actions, this.maxCurrentRoundBet - player.currentRoundBet, player.user.balance, player.bets, this.userTimeoutCounter);
        player.send(message);
    };

    this.next = function() {
        this.processMessage();
        this.sendGameStateToPlayers();
        if (this.conductingBets) {
            this.conductNextBet();
        } else if (this.canAdvanceToNextRound) {
            this.advanceToNextRound();
        } else if (this.round === Rounds.WAITING) {
            this.players.addWaitingPlayers();
            if (this.players.getNumberOfPlayers(Status.ACTIVE, true) >= 2) {
                this.canAdvanceToNextRound = true;
            }
        } else if (this.round === Rounds.SETUP) {
            this.setupTable();
        } else if (this.round === Rounds.BET) {
            this.playBetRound();

        } else if (this.round === Rounds.FLOP) {
            this.log.logGame(this.tableId, this.roundId, "Flop round starting. Flop cards revealed: " + this.flop.toString());
            this.playFlopRound();

        } else if (this.round === Rounds.TURN) {
            this.log.logGame(this.roundId, this.roundId, "Turn Round is starting. Turn card revealed: " + this.turn.toString());
            this.playTurnRound();

        } else if (this.round === Rounds.RIVER) {
            this.log.logGame(this.roundId, this.roundId, "River Round is starting. River card revealed: " + this.river.toString());
            this.playRiverRound();

        } else if (this.round === Rounds.FINAL) {
            this.log.logGame(this.roundId, this.roundId, "Game is finished. Determining winner ...");
            this.determineWinner();
        } else if (this.round === Rounds.CLEANUP) {
            this.log.logGame(this.roundId, this.roundId, "Cleaning up the table");
            this.cleanupTable();
            this.log.logGame(this.roundId, this.roundId, "Returning Table to Waiting Phase");
        } else {
            this.log.logGameError("Invalid Table State detected");
        }
        this.sendGameStateToPlayers();
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
        this.canAdvanceToNextRound = true;
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
            this.players.getPlayerAt(this.smallBlind).currentRoundBet += this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).currentRoundBet += this.bigBlindAmount;
            this.players.getPlayerAt(this.smallBlind).bets += this.smallBlindAmount;
            this.players.getPlayerAt(this.bigBlind).bets += this.bigBlindAmount;

            // Add Blind amount to the pot
            this.pot += this.smallBlindAmount;
            this.pot += this.bigBlindAmount;

            this.maxCurrentRoundBet = this.bigBlindAmount;
            this.startBetting(this.maxCurrentRoundBet);
        } else {
            this.canAdvanceToNextRound = true;
        }
    };

    this.playFlopRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.FLOP;
            this.startBetting(0);
        } else {
            this.canAdvanceToNextRound = true;
        }
    };

    this.playTurnRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.TURN;
            this.startBetting(0);
        } else {
            this.canAdvanceToNextRound = true;
        }
    };

    this.playRiverRound = function () {
        if (this.players.getNumberOfPlayers(Status.ACTIVE, true) > 1) {
            this.round = Rounds.RIVER;
            this.startBetting(0);
        } else {
            this.canAdvanceToNextRound = true;
        }
    };

    this.determineWinner = function () {
        this.round = Rounds.FINAL;
        var topPlayer = null;
        var topPlayerIndex = -1;
        for (var i = 0; i < this.players.getNumberOfPlayers(Status.ALL, true); i++) {
            var player = this.players.getPlayerAt(i);
            if (player.status !== Status.EMPTY && player.status !== Status.FOLDED) {
                var cards = [];
                cards.push(this.flop[0]);
                cards.push(this.flop[1]);
                cards.push(this.flop[2]);
                cards.push(this.turn);
                cards.push(this.river);
                cards.push(player.cardA);
                cards.push(player.cardB);
                player.rank = rankHand(cards);
                if (topPlayer === null || compareRankings(player.rank, topPlayer.rank) > 0) {
                    topPlayer = player;
                    topPlayerIndex = i;
                } else if (compareRankings(player.rank, topPlayer) === 0) {
                    topPlayer = player;
                    topPlayerIndex = i;
                }
            }
        }
        this.canAdvanceToNextRound = true;
        this.winner = topPlayerIndex;
        topPlayer.user.balance += this.pot;
        this.pot = 0;
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
        this.maxCurrentRoundBet = 0;

        // Add Player Hands back
        for (var i = 0; i < this.players.getNumberOfPlayers(); i++) {
            this.deck.deck.push(this.players.getPlayerAt(i).handA);
            this.deck.deck.push(this.players.getPlayerAt(i).handB);
        }
        this.canAdvanceToNextRound = true;
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

    this.startBetting = function(startingBet) {
        this.conductingBets = true;
        this.maxCurrentRoundBet = startingBet;
        this.currentPlayer = this.players.getNextPlayerIndex(0, Status.ALL, true, true, true);
        this.lastPlayer = -1; // special value used in conductNextBet
        this.log.logGame(this.tableId, this.roundId, "Betting starting for " + this.round + " round");
    };

    this.conductNextBet = function() {
        // Indicates we've reached the end of iteration
        if (this.currentPlayer === this.lastPlayer) {
            this.maxCurrentRoundBet = 0;
            this.waitingForInput = false;
            this.conductingBets = false;
            this.canAdvanceToNextRound = true;
            this.userTimeoutCounter = 0;
            this.userTimeoutFunction = null;
            clearInterval(this.userTimeoutFunction);

            // Reset current round bets for player
            for (var i = 0; i < this.players.getNumberOfPlayers(Status.ALL, true); i++) {
                var player = this.players.getPlayerAt(i);
                player.currentRoundBet = 0;
            }

            this.log.logGame(this.tableId, this.roundId, "Ending betting for round " + this.round);
        } else if (this.players.getPlayerAt(this.currentPlayer).status === Status.ACTIVE) {
            var player = this.players.getPlayerAt(this.currentPlayer);
            if (this.waitingForInput === false) {
                this.waitingForInput = true;
                this.userTimeoutFunction = setInterval(function() {
                    this.userTimeoutCounter++;
                }.bind(this), 1000);
                this.log.logSystem("Getting action and starting user timeout for player " + player.user.username);
            }

            if (this.userTimeoutCounter >= 35) {
                this.log.logSystem("Player " + player.user.username + " has TIMED OUT");
                player.status = Status.FOLDED;
                player.currentAction = null;
                player.lastAction = Actions.TIMEOUT;
                clearInterval(this.userTimeoutFunction);
                this.userTimeoutFunction = null;
                this.userTimeoutCounter = 0;
                this.waitingForInput = false;
                this.currentPlayer = this.players.getNextPlayerIndex(this.currentPlayer, Status.ALL, true, false, true);
            } else if (player.currentAction !== null) {
                this.log.logSystem("Action has been received for player " + player.user.username + ". (" + JSON.stringify(player.currentAction) + "). Processing user action. ");
                this.conductIndividualBet(this.currentPlayer);
                if (this.lastPlayer === -1) {
                    this.lastPlayer = this.currentPlayer;
                }

                clearInterval(this.userTimeoutFunction);
                this.userTimeoutFunction = null;
                this.userTimeoutCounter = 0;
                this.waitingForInput = false;
                this.currentPlayer = this.players.getNextPlayerIndex(this.currentPlayer, Status.ALL, true, false, true);
                this.log.logSystem("Advancing to next user at index: " +this.currentPlayer);
            } else {
                this.sendGetUserAction();
                return;
            }
        } else {
            if (this.lastPlayer === -1) {
                this.lastPlayer = this.currentPlayer;
            }
            this.log.logSystem("User at index: " +this.currentPlayer + " is NOT ACTIVE");
            clearInterval(this.userTimeoutFunction);
            this.userTimeoutFunction = null;
            this.userTimeoutCounter = 0;
            this.waitingForInput = false;
            this.currentPlayer = this.players.getNextPlayerIndex(this.currentPlayer, Status.ALL, true, false, true);
            this.log.logSystem("Advancing to next user at index: " +this.currentPlayer);
        }
    };

    this.conductIndividualBet = function(currentPlayer) {
        if (this.players.getPlayerAt(currentPlayer).status === Status.ACTIVE) {
            var player = this.players.getPlayerAt(currentPlayer);
            var checkable =  player.currentRoundBet >= this.maxCurrentRoundBet;
            var callable = player.currentRoundBet + player.user.balance >= this.maxCurrentRoundBet;
            var hasRemainingBalance = player.user.balance > 0;
            var input = player.receive();

            if (input.action === Actions.CHECK) {
                if (checkable) {
                    this.log.logGame(this.tableId, this.roundId, player.user.username + " has CHECKED");
                } else {
                    this.log.logGameError(this.tableId, this.roundId, player.user.username + " has CHECKED, despite not meeting the bet amount");
                    player.status = Status.FOLDED;
                }

            } else if (input.action === Actions.FOLD) {
                player.status = Status.FOLDED;
                this.log.logGame(this.tableId, this.roundId, player.user.username + " has FOLDED");

            } else if (input.action === Actions.LEAVE) {
                this.log.logGame(this.tableId, this.roundId, player.user.username + " has LEFT the game");
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
                    this.log.logGame(this.tableId, this.roundId, player.user.username + " has CALLED for " + callAmount);

                    if (player.user.balance <= 0) {
                        player.status = Status.ALLIN;
                        this.log.logGame(this.tableId, this.roundId, player.user.username + " has CALLED for their remaining balance, going ALL IN");
                    }
                } else {
                    this.log.logGameError(this.tableId, this.roundId, "INVALID MOVE: " + player.user.username + " attempted to call for " +callAmount);
                    player.status = Status.FOLDED;
                }

            } else if (input.action === Actions.ALLIN) {
                if (hasRemainingBalance) {
                    player.bets += player.user.balance;
                    player.currentRoundBet += player.user.balance;
                    this.pot += player.user.balance;
                    player.user.balance = 0;
                    player.status = Status.ALLIN;
                    this.lastPlayer = this.currentPlayer;
                    if (player.currentRoundBet > this.maxCurrentRoundBet) {
                        this.maxCurrentRoundBet = player.currentRoundBet;
                    }
                    this.log.logGame(this.tableId, this.roundId, player.user.username + " went ALL IN for " + player.user.balance);
                } else {
                    this.log.logGameError(this.tableId, this.roundId, player.user.username + " attempted to go ALL IN, but lacked a remaining balance");
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

                    this.log.logGame(this.tableId, this.roundId, player.user.username + " has RAISED by " + input.betAmount);
                    if (player.user.balance <= 0) {
                        player.status = Status.ALLIN;
                        this.log.logGame(this.tableId, this.roundId, player.user.username + " has RAISED by their remaining balance, going ALL IN");
                    }

                } else {
                    player.status = Status.FOLDED;
                    this.log.logGameError(this.tableId, this.roundId, player.user.username + " attempted to RAISE, but lacked sufficient funds and was forcibly folded");
                }

            } else if (input.action === Actions.TIMEOUT) {
                player.status = Status.FOLDED;
                this.log.logGame(this.tableId, this.roundId, player.user.username + " has TIMED OUT");
            } else {
                this.log.logGameError(this.tableId, this.roundId, player.user.username + " has provided an unrecognized action: " + input.action);
            }
        }
    };

    this.sendGameStateToPlayers = function() {
        var localFlop1 = null;
        var localFlop2 = null;
        var localFlop3 = null;
        var localTurn = null;
        var localRiver = null;
        if (this.round === Rounds.FLOP) {
            localFlop1 = new CardComponent(this.flop[0].suite, this.flop[0].rank);
            localFlop2 = new CardComponent(this.flop[1].suite, this.flop[1].rank);
            localFlop3 = new CardComponent(this.flop[2].suite, this.flop[2].rank);
        } else if (this.round === Rounds.TURN) {
            localFlop1 = new CardComponent(this.flop[0].suite, this.flop[0].rank);
            localFlop2 = new CardComponent(this.flop[1].suite, this.flop[1].rank);
            localFlop3 = new CardComponent(this.flop[2].suite, this.flop[2].rank);
            localTurn = new CardComponent(this.turn.suite, this.turn.rank);
        } else if (this.round === Rounds.RIVER) {
            localFlop1 = new CardComponent(this.flop[0].suite, this.flop[0].rank);
            localFlop2 = new CardComponent(this.flop[1].suite, this.flop[1].rank);
            localFlop3 = new CardComponent(this.flop[2].suite, this.flop[2].rank);
            localTurn = new CardComponent(this.turn.suite, this.turn.rank);
            localRiver = new CardComponent(this.river.suite, this.river.rank);
        } else if (this.round === Rounds.FINAL) {
            localFlop1 = new CardComponent(this.flop[0].suite, this.flop[0].rank);
            localFlop2 = new CardComponent(this.flop[1].suite, this.flop[1].rank);
            localFlop3 = new CardComponent(this.flop[2].suite, this.flop[2].rank);
            localTurn = new CardComponent(this.turn.suite, this.turn.rank);
            localRiver = new CardComponent(this.river.suite, this.river.rank);
        }
        var table = new TableMessageComponent(this.maxCurrentRoundBet, this.pot, this.roundId, this.round, this.currentPlayer, this.userTimeoutCounter, this.winner, localFlop1, localFlop2, localFlop3,  localTurn, localRiver);
        var otherUsers = [];
        for (let i = 0; i < this.players.getNumberOfPlayers(Status.ALL, true); i++) {
            let player = this.players.getPlayerAt(i);
            if (player.status !== Status.EMPTY) {
                let cardA = null;
                let cardB = null;
                if (this.round === Rounds.FINAL) {
                    cardA = new CardComponent(player.cardA.suite, player.cardA.rank);
                    cardB = new CardComponent(player.cardB.suite, player.cardB.rank);
                }
                let playerComponent = new OtherPlayerMessageComponent(player.user.username, player.seat, player.user.balance,
                    player.currentRoundBet, player.status, player.lastAction, cardA, cardB, this.bigBlind === i, this.smallBlind === i);
                otherUsers.push(playerComponent);
            } else {
                let playerComponent = new OtherPlayerMessageComponent("Empty Seat", player.seat, 0, 0, Status.EMPTY, Actions.UNDEFINED, null, null, false, false);
            }
        }
        var message = new GameStatusMessage(new CurrentPlayerMessageComponent(), otherUsers, table);
        for ( let i = 0; i < this.players.players.length; i++) {
            if ( this.players.players[i].status !== Status.EMPTY ) {
                this.players.players[i].send(message);
            }
        }
    };

    this.toString = function() {
        var str = "";
        str += "Table ID: " + this.tableId +"\n";
        str += "Round ID: " + this.roundId + "\n";
        str += "Round: " + this.round + "\n\n";
        str += "Pot: " + this.pot + "\n";
        str += "Max Current Round Bets: " + this.maxCurrentRoundBet +"\n";
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
