const Status = require('./definition').Status;
const Actions = require('./definition').Actions;
const Rounds = require('./definition').Rounds;

function CurrentPlayerMessageComponent(name, balance, status, cardA, cardB) {

}

function OtherPlayerMessageComponent (name, balance, status) {

}

function TableMessageComponent () {

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
function GameStatusMessage (activePlayers, currentPlayer, maxBet, pot, flop, turn, river, winningHand) {

    this.activePlayers = activePlayers;
    this.currentPlayer = currentPlayer;
    this.maxBet = maxBet;
    this.pot = pot;
    this.flop = flop;
    this.turn = turn;
    this.river = river;
    this.winningHand = winningHand;
};

function GetUserActionMessage (validActions, callAmount) {
    this.validActions = validActions;
    this.callAmount = callAmount;
};
