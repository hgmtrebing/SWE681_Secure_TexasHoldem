var Table = require('./table').Table;
var Actions = require('./definition').Actions;

var inputCounter = 0;
var testInput = [
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},

    {action: Actions.RAISE, betAmount: 300},
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
    {action: Actions.FOLD, betAmount: 0},

    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
    {action: Actions.CHECK, betAmount: 0},
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
    table.playGame();
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
