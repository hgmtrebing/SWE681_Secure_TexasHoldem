const Status = require('./definition').Status;
const Actions = require('./definition').Actions;
const Rounds = require('./definition').Rounds;
const Suite = require('./carddeck').Suite;
const Rank = require('./carddeck').Rank;
const Log = require('./log');
const log = new Log.Log();

function CurrentPlayerMessageComponent(name, balance, status, cardA, cardB, isBigBlind, isSmallBlind) {
    this._id = 1;
    this.name = name;
    this.balance = balance;
    this.status = status;
    this.cardA = cardA;
    this.cardB = cardB;
    this.isBigBlind = isBigBlind;
    this.isSmallBlind = isSmallBlind;
}

function OtherPlayerMessageComponent (name, balance, bet, status, isBigBlind, isSmallBlind) {
    this._id = 2;
    this.name = name;
    this.balance = balance;
    this.bet = bet;
    this.status = status;
    this.isBigBlind = isBigBlind;
    this.isSmallBlind = isSmallBlind;
}

function CardComponent (suite, rank) {
    var validMessage = true;
    if (!suite instanceof Suite) {
        validMessage = false;
        log.logSystemError("suite in CardComponent was of type " + typeof suite + " , not type Suite");
    } else if (!rank instanceof Rank) {
        validMessage = false;
        log.logSystemError("rank in CardComponent was of type " + typeof rank + " , not type Rank");
    }

    if (!validMessage) {
        throw "CardComponent given invalid arguments to constructor. Check log for details";
    }

    this._id = 7;
    this.suiteName = suite.name;
    this.rankName = rank.name;
}

function TableMessageComponent (maxBet, pot, gameNumber, round, flop1, flop2, flop3, turn, river) {
    var validMessage = true;
    if (typeof maxBet !== 'number' ) {
        validMessage = false;
        log.logSystemError("maxBet in TableMessageComponet was of type " + typeof maxBet + " , not type number");
    } else if (typeof pot !== 'number') {
        validMessage = false;
        log.logSystemError("pot in TableMessageComponet was of type " + typeof pot + " , not type number");

    } else if (typeof gameNumber !== 'number') {
        validMessage = false;
        log.logSystemError("gameNumber in TableMessageComponet was of type " + typeof gameNumber + " , not type number");

    } else if (round !== Rounds.WAITING.toString() && round !== Rounds.BET.toString() &&
        round !== Rounds.FLOP.toString() && round !== Rounds.TURN.toString() && round !== Rounds.RIVER.toString() &&
    round !== Rounds.FINAL.toString() && round !== Rounds.CLEANUP.toString()) {
        validMessage = false;
        log.logSystemError("round in TableMessageComponet was given " + round + ", not a value in definition.js.Rounds");

    } else if (!flop1 instanceof CardComponent) {
        validMessage = false;
        log.logSystemError("flop1 in TableMessageComponet was of type " + typeof flop1 + " , not type CardComponent");

    } else if (!flop2 instanceof CardComponent) {
        validMessage = false;
        log.logSystemError("flop2 in TableMessageComponet was of type " + typeof flop2 + " , not type CardComponent");

    } else if (!flop3 instanceof CardComponent) {
        validMessage = false;
        log.logSystemError("flop3 in TableMessageComponet was of type " + typeof flop3 + " , not type CardComponent");

    } else if (!turn instanceof CardComponent) {
        validMessage = false;
        log.logSystemError("turn in TableMessageComponet was of type " + typeof turn + " , not type CardComponent");

    } else if (!river instanceof CardComponent) {
        validMessage = false;
        log.logSystemError("river in TableMessageComponet was of type " + typeof river + " , not type CardComponent");

    }

    if (!validMessage) {
        throw "TableMessageComponent given invalid arguments to constructor. Check log for details";
    }

    this._id = 3;
    this.maxBet = maxBet;
    this.pot = pot;
    this.gameNumber = gameNumber;
    this.round = round;
    this.flop1 = flop1;
    this.flop2 = flop2;
    this.flop3 = flop3;
    this.turn = turn;
    this.river = river;
}

/**
 * This message is sent by a Player during the player's turn to the server.
 * @param action
 * @param betAmount
 * @constructor
 */
function UserActionMessage (action, betAmount) {
    this._id = 4;
    if (!action in Actions) {
        throw "The action of UserAction must be a valid action";
    } else if (!betAmount instanceof Number) {
        throw "The Bet Amount must be a Number";
    }
    this.action = action;
    this.betAmount = betAmount;
}

/**
 * Message sent from the server to all players to communicate the state of the game.
 * @param activePlayers
 * @param currentPlayer
 * @param maxBet
 * @param pot
 * @param flop
 * @param turn
 * @param river
 * @constructor
 */
function GameStatusMessage (activePlayers, tableStatus) {
    this._id = 5;
    this.activePlayers = activePlayers;
    this.tableStatus = tableStatus;
};

function GetUserActionMessage (validActions, callAmount) {
    this._id = 6;
    this.validActions = validActions;
    this.callAmount = callAmount;
};

module.exports = {
    GameStatusMessage : GameStatusMessage,
    GetUserActionMessage : GetUserActionMessage,
    UserActionMessage : UserActionMessage,
    TableMessageComponent : TableMessageComponent,
    CurrentPlayerMessageComponent : CurrentPlayerMessageComponent,
    OtherPlayerMessageComponent : OtherPlayerMessageComponent,
    CardComponent: CardComponent
};
