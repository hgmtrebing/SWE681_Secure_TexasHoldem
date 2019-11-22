const Status = require('./definition').Status;
const Actions = require('./definition').Actions;
const Rounds = require('./definition').Rounds;

function CurrentPlayerMessageComponent(name, balance, status, cardA, cardB, isBigBlind, isSmallBlind) {
    this.name = name;
    this.balance = balance;
    this.status = status;
    this.cardA = cardA;
    this.cardB = cardB;
    this.isBigBlind = isBigBlind;
    this.isSmallBlind = isSmallBlind;
}

function OtherPlayerMessageComponent (name, balance, bet, status, isBigBlind, isSmallBlind) {
    this.name = name;
    this.balance = balance;
    this.bet = bet;
    this.status = status;
    this.isBigBlind = isBigBlind;
    this.isSmallBlind = isSmallBlind;
}

function TableMessageComponent (maxBet, pot, round, flop, turn, river) {
    this.maxBet = maxBet;
    this.pot = pot;
    this.round = round;
    this.flop = flop;
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
    this.activePlayers = activePlayers;
    this.tableStatus = tableStatus;
};

function GetUserActionMessage (validActions, callAmount) {
    this.validActions = validActions;
    this.callAmount = callAmount;
};

module.exports = {
    GameStatusMessage : GameStatusMessage,
    GetUserActionMessage : GetUserActionMessage,
    UserActionMessage : UserActionMessage,
    TableMessageComponent : TableMessageComponent,
    CurrentPlayerMessageComponent : CurrentPlayerMessageComponent,
    OtherPlayerMessageComponent : OtherPlayerMessageComponent
};