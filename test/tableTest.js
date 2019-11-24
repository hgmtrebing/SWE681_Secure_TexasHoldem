const TestResult = require('./TestResult').TestResult;
const Table = require('../server/table').Table;
const defines = require('../server/definition');

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

function conductIndividualBetCallTest01 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser ({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "CALL", betAmount: 0};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 400;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 400 || player.bets !== 400 || player.currentRoundBet !== 400 || player.status !== defines.Status.ACTIVE ||
    player.user.balance !== 9600) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetCallTest01. Pot = " + table.pot + ", Player.bets = " + player.bets +
    ", Player.currentRoundBets = " + player.currentRoundBet + ", Player.Status = " + player.status + ", Player.user.balance = " +
    player.user.balance);
}

function conductIndividualBetCallTest02 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser ({name: "u0", balance: 1000});
    player.receive = function() {
        return {action: "CALL", betAmount: 0};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 1500;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || player.bets !== 0 || player.currentRoundBet !== 0 || player.status !== defines.Status.FOLDED ||
    player.user.balance !== 1000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualCallTest02. Pot = " + table.pot + ", Player.bets = " + player.bets +
        ", Player.currentRoundBets = " + player.currentRoundBet + ", Player.Status = " + player.status + ", player.user.balance = " +
    player.user.balance);
}

function conductIndividualBetCallTest03 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 0});
    player.receive = function () {
        return {action: "CALL", betAmount: 0};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 0;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || player.bets !== 0 || player.currentRoundBet !== 0 || player.status !== defines.Status.ACTIVE ||
    player.user.balance !== 0) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetCallTest03. Pot = " + table.pot + ", Player.bets = " + player.bets +
        ", Player.currentRoundBets = " + player.currentRoundBet + ", Player.Status = " + player.status + ", player.user.balance = " +
    player.user.balance);
}

function conductIndividualBetRaiseTest01 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function () {
        return {action: "RAISE", betAmount: 1000};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 0;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 1000 || table.maxCurrentRoundBet !== 1000 || player.bets !== 1000 ||
        player.currentRoundBet !== 1000 || player.status !== defines.Status.ACTIVE || player.user.balance !== 9000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetRaiseTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetRaiseTest02 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function () {
        return {action: "RAISE", betAmount: 2000};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 1525;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 2000 || table.maxCurrentRoundBet !== 2000 || player.bets !== 2000 ||
        player.currentRoundBet !== 2000 || player.status !== defines.Status.ACTIVE || player.user.balance !== 8000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetRaiseTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetRaiseTest03 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function () {
        return {action: "RAISE", betAmount: 12000};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 0;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 0 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.FOLDED || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetRaiseTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetRaiseTest04 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function () {
        return {action: "RAISE", betAmount: 0};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 0;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 0 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.ACTIVE || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetRaiseTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetRaiseTest05 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function () {
        return {action: "RAISE", betAmount: 1500};
    };
    table.setupTable();
    table.maxCurrentRoundBet = 2500;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 2500 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.FOLDED || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetRaiseTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function runAllTests() {
    var testResults = [];
    testResults.push(setupTableTest01());
    testResults.push(setupTableTest02());
    testResults.push(conductIndividualBetCallTest01());
    testResults.push(conductIndividualBetCallTest02());
    testResults.push(conductIndividualBetCallTest03());
    testResults.push(conductIndividualBetRaiseTest01());
    testResults.push(conductIndividualBetRaiseTest02());
    testResults.push(conductIndividualBetRaiseTest03());
    testResults.push(conductIndividualBetRaiseTest04());
    testResults.push(conductIndividualBetRaiseTest05());

    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
