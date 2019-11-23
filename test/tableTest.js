const TestResult = require('./TestResult').TestResult;
const Table = require('../server/table').Table;
const defines = require('../server/definition');

function setupDummyTable(table) {
    var array = table.players.players;
    for (var i = 0; i < array.length; i++) {
        array[i].user = {name: "u" + i, balance: 10000};
        array[i].status = "ACTIVE";
        array[i].receive = getUserInput;
    }
    table.bigBlindAmount = 200;
    table.smallBlindAmount = 100;
}

function getUserInput(args) {
    args.inputCounter++;
    return args.testInput[inputCounter - 1];
}

function setupTableTest01 () {
    var table = new Table(15);
    table.setupTable();
    var passed = true;
    if (table.deck.deck.length !== 47 || table.tableId !== 15 || table.roundId !== 1 || table.flop.length !== 3 ||
    table.turn === null || table.river === null || table.round !== defines.Rounds.SETUP) {
        passed = false;
    }
    return new TestResult(passed, "setupTableTest01. Table checked to see if it maintains critical invariants after " +
        "setupTable() is called");
}

function setupTableTest02 () {
    var table = new Table(29);
    table.players.getPlayerAt(0).addUser ({name: "u0", balance: 10000});
    table.players.getPlayerAt(1).addUser ({name: "u1", balance: 10000});
    table.players.getPlayerAt(2).addUser ({name: "u2", balance: 10000});
    table.players.getPlayerAt(3).addUser ({name: "u3", balance: 10000});
    table.players.getPlayerAt(4).addUser ({name: "u4", balance: 10000});
    table.players.getPlayerAt(5).addUser ({name: "u5", balance: 10000});
    table.setupTable();
    var passed = true;
    if (table.deck.deck.length !== 35 || table.tableId !== 29 || table.roundId !== 1 || table.flop.length !== 3 ||
        table.turn === null || table.river === null || table.round !== defines.Rounds.SETUP) {
        passed = false;
    }
    return new TestResult(passed, "setupTableTest02. Table checked to see if it maintains critical invariants after " +
        "setupTable() is called");
}

function conductIndividualBet01 () {
    var table = new Table(1);
    setupDummyTable(table);
    table.setupTable();
    table.conductIndividualBet(0)
}

function runAllTests() {
    var testResults = [];
    testResults.push(setupTableTest01());
    testResults.push(setupTableTest02());
    testResults.push(conductIndividualBet01());

    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
