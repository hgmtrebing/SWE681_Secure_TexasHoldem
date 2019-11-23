var Table = require('./table').Table;
var Actions = require('./definition').Actions;

var inputCounter = 0;
var testInput = [
    {action: Actions.RAISE, betAmount: 500},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.RAISE, betAmount: 600},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},

    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},

    {action: Actions.RAISE, betAmount: 425},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},

    {action: Actions.ALLIN, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
    {action: Actions.CALL, betAmount: 0},
];

function testCase01() {
    table = new Table(0);
    var array = table.players.players;
    for (var i = 0; i < array.length; i++) {
        array[i].user = {name: "u" + i, balance: 10000};
        array[i].status = "ACTIVE";
        array[i].receive = getUserInput;
    }
    table.bigBlindAmount = 200;
    table.smallBlindAmount = 100;

    table.setupTable();
    console.log(table.toString());

    table.playBetRound();
    console.log(table.toString());

    table.playFlopRound();
    console.log(table.toString());

    table.playTurnRound();
    console.log(table.toString());

    table.playRiverRound();
    console.log(table.toString());

}

function getUserInput() {
    inputCounter++;
    return testInput[inputCounter-1];
}

module.exports = {
    testCase01 : testCase01,
    getUserInput : getUserInput
};

testCase01();
