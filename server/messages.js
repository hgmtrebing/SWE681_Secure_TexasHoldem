const Status = require('./definition').Status;
const Actions = require('./definition').Actions;
const Rounds = require('./definition').Rounds;
const Suite = require('./carddeck').Suite;
const Rank = require('./carddeck').Rank;
const Log = require('./log');
const log = new Log.Log();

function CurrentPlayerMessageComponent(cardA, cardB) {
    this._id = 1;
    this.cardA = cardA;
    this.cardB = cardB;
}

function OtherPlayerMessageComponent (name, seat, balance, bet, status, action, cardA, cardB, isBigBlind, isSmallBlind) {
    var validMessage = true;

    // Type check - name should be a string
    if (typeof name !== 'string') {
        validMessage = false;
        log.logSystemError("name in OtherPlayerMessageComponent was of type " + typeof name + " , not type String");

    }

    if (typeof balance !== 'number') {
        validMessage = false;
        log.logSystemError("balance in OtherPlayerMessageComponent was of type " + typeof balance + " , not type number");

    }

    if (typeof bet !== 'number') {
        validMessage = false;
        log.logSystemError("bet in OtherPlayerMessageComponent was of type " + typeof bet + " , not type number");

    }

    if (status !== Status.ACTIVE && status !== Status.FOLDED && status !== Status.EMPTY &&
    status !== Status.ALLIN) {
        validMessage = false;
        log.logSystemError("status in OtherPlayerMessageComponent was of type " + typeof status + " , not type String");

    }

    if (!action in Actions) {
        validMessage = false;
        log.logSystemError("action in OtherPlayerMessageComponent was of type " + typeof action + " , not a valid Action");
    }

    if (typeof isBigBlind !== 'boolean') {
        validMessage = false;
        log.logSystemError("isBigBlind in OtherPlayerMessageComponent was of type " + typeof isBigBlind + " , not type boolean");
    }

    if (typeof isSmallBlind !== 'boolean') {
        validMessage = false;
        log.logSystemError("isSmallBlind in OtherPlayerMessageComponent was of type " + typeof isSmallBlind + " , not type boolean");
    }

    if (!cardA instanceof CardComponent) {
        validMessage = false;
        log.logSystemError("cardA in OtherPlayerMessageComponent was of type " + typeof cardA + " , not type CardComponent");
    }

    if (!cardB instanceof CardComponent) {
        validMessage = false;
        log.logSystemError("cardB in OtherPlayerMessageComponent was of type " + typeof cardB + " , not type CardComponent");
    }

    if (!validMessage) {
        throw "OtherPlayerMessageComponent constructed incorrectly. Check the log for more details"
    }

    this._id = 2;
    this.name = name;
    this.balance = balance;
    this.bet = bet;
    this.status = status;
    this.action = action;
    this.cardA = cardA;
    this.cardB = cardB;
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

function TableMessageComponent (maxBet, pot, gameNumber, round, activePlayer, timer, winner, flop1, flop2, flop3, turn, river) {
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

    } else if (!round in Rounds) {
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
    this.activePlayer = activePlayer;
    this.timer = timer;
    this.winner = winner;
    this.flop1 = flop1;
    this.flop2 = flop2;
    this.flop3 = flop3;
    this.turn = turn;
    this.river = river;
}

/**
 * This message is sent by a Player during the player's turn to the server.
 * @param action
 * @param callAmount
 * @param balance
 * @param bets
 * @param timerStart
 * @constructor
 */
function UserActionMessage (username, jwt, action, betAmount) {
    this._id = 4;

    for (var i = 0; i < action.length; i++) {
        if (!action[i] in Actions) {
            throw "The action of UserAction must be a valid action";
        }
    }

    if (!betAmount instanceof Number) {
        throw "The Bet Amount must be a Number";
    }

    this.username = username;
    this.jwt = jwt;
    this.action = action;
    this.betAmount = betAmount;
}

/**
 * Message sent from the server to all players to communicate the state of the game.
 * @param otherPlayers
 * @param tableStatus - tableMessageComponent
 * @constructor
 */
function GameStatusMessage (currentPlayer, otherPlayers, tableStatus) {
    this._id = 5;
    this.currentPlayer = currentPlayer;
    this.otherPlayers = otherPlayers;
    this.tableStatus = tableStatus;
}

function GetUserActionMessage (validActions, callAmount, balance, bets, timerStart) {
    this._id = 6;
    this.validActions = validActions;
    this.callAmount = callAmount;
    this.balance = balance;
    this.bets = bets;
    this.timerStart = timerStart;
}

module.exports = {
    GameStatusMessage : GameStatusMessage,
    GetUserActionMessage : GetUserActionMessage,
    UserActionMessage : UserActionMessage,
    TableMessageComponent : TableMessageComponent,
    CurrentPlayerMessageComponent : CurrentPlayerMessageComponent,
    OtherPlayerMessageComponent : OtherPlayerMessageComponent,
    CardComponent: CardComponent
};
