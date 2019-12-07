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
    player.user.socket = {};
    player.user.socket.emit = function () {};

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
    player.user.socket = {};
    player.user.socket.emit = function () {};
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
    player.user.socket = {};
    player.user.socket.emit = function () {};
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
    player.user.socket = {};
    player.user.socket.emit = function () {};
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
    player.user.socket = {};
    player.user.socket.emit = function () {};
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
    player.user.socket = {};
    player.user.socket.emit = function () {};
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
    player.user.socket = {};
    player.user.socket.emit = function () {};
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
    player.user.socket = {};
    player.user.socket.emit = function () {};
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

function conductIndividualBetFoldTest01 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "FOLD", betAmount: 0};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 3500;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 3500 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.FOLDED || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetFoldTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetFoldTest02 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "RAISE", betAmount: 5000};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();

    player.status = defines.Status.FOLDED;
    table.maxCurrentRoundBet = 3500;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 3500 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.FOLDED || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetFoldTest02. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetCheckTest01 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "CHECK", betAmount: 0};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 0;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 0 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.ACTIVE || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetCheckTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetCheckTest02 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "CHECK", betAmount: 500};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 0;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 0 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.ACTIVE || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetCheckTest02. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetCheckTest03 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "CHECK", betAmount: 500};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 250;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 250 || player.bets !== 0 ||
        player.currentRoundBet !== 0 || player.status !== defines.Status.FOLDED || player.user.balance !== 10000) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetCheckTest03. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetAllinTest01 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "ALLIN", betAmount: 0};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 250;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 10000 || player.bets !== 10000 ||
        player.currentRoundBet !== 10000 || player.status !== defines.Status.ALLIN || player.user.balance !== 0) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetAllinTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetAllinTest02 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "ALLIN", betAmount: 500};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 13000;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 13000 || player.bets !== 10000 ||
        player.currentRoundBet !== 10000 || player.status !== defines.Status.ALLIN || player.user.balance !== 0) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetAllinTest02. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductIndividualBetAllinTest03 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser({name: "u0", balance: 10000});
    player.receive = function() {
        return {action: "ALLIN", betAmount: 500};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    player.bets = 1000;

    table.setupTable();
    table.maxCurrentRoundBet = 13000;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || table.maxCurrentRoundBet !== 13000 || player.bets !== 11000 ||
        player.currentRoundBet !== 10000 || player.status !== defines.Status.ALLIN || player.user.balance !== 0) {
        passed = false;
    }
    return new TestResult(passed, "conductIndividualBetAllinTest03. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player.bets = " + player.bets + ", Player.currentRoundBets = " + player.currentRoundBet +
        ", Player.Status = " + player.status + ", Player.user.balance = " + player.user.balance);
}

function conductBetsTest01 () {
    var table = new Table(1);

    var player0 = table.players.getPlayerAt(0);
    player0.addUser({name: "u0", balance: 10000});
    player0.actionCounter = 0;
    player0.receive = function() {
         var actions = [
            {action: "CHECK", betAmount: 0},
            {action: "CHECK", betAmount: 0},
        ];
        return actions[player0.actionCounter++];
    };
    player0.user.socket = {};
    player0.user.socket.emit = function () {};

    var player1 = table.players.getPlayerAt(1);
    player1.addUser({name: "u0", balance: 10000});
    player1.actionCounter = 0;
    player1.receive = function() {
        var actions = [
            {action: "CHECK", betAmount: 0},
            {action: "CALL", betAmount: 0},
            {action: "CALL", betAmount: 0},
        ];
        return actions[player1.actionCounter++];
    };
    player1.user.socket = {};
    player1.user.socket.emit = function () {};

    var player2 = table.players.getPlayerAt(2);
    player2.addUser({name: "u0", balance: 10000});
    player2.actionCounter = 0;
    player2.receive = function() {
        var actions = [
            {action: "CHECK", betAmount: 0},
            {action: "RAISE", betAmount: 2000},
        ];
        return actions[player2.actionCounter++];
    };
    player2.user.socket = {};
    player2.user.socket.emit = function () {};

    var player3 = table.players.getPlayerAt(3);
    player3.addUser({name: "u0", balance: 10000});
    player3.actionCounter = 0;
    player3.receive = function() {
        var actions = [
            {action: "RAISE", betAmount: 1500},
            {action: "CALL", betAmount: 0},
        ];
        return actions[player3.actionCounter++];
    };
    player3.user.socket = {};
    player3.user.socket.emit = function () {};

    var player4 = table.players.getPlayerAt(4);
    player4.addUser({name: "u0", balance: 10000});
    player4.actionCounter = 0;
    player4.receive = function() {
        var actions = [
            {action: "CALL", betAmount: 0},
            {action: "CALL", betAmount: 0},
        ];
        return actions[player4.actionCounter++];
    };
    player4.user.socket = {};
    player4.user.socket.emit = function () {};

    var player5 = table.players.getPlayerAt(5);
    player5.addUser({name: "u0", balance: 10000});
    player5.actionCounter = 0;
    player5.receive = function() {
        var actions = [
            {action: "CALL", betAmount: 0},
            {action: "FOLD", betAmount: 0},
        ];
        return actions[player5.actionCounter++];
    };
    player5.user.socket = {};
    player5.user.socket.emit = function () {};

    table.setupTable();
    table.conductBets(0);

    var passed = true;
    if (table.pot !== 9500 || player0.status !== defines.Status.FOLDED || player1.status !== defines.Status.ACTIVE ||
    player2.status !== defines.Status.ACTIVE || player3.status !== defines.Status.ACTIVE || player4.status !== defines.Status.ACTIVE || player5.status !== defines.Status.FOLDED || player0.bets !== 0 || player1.bets !== 2000 || player2.bets !==
    2000 || player3.bets !== 2000 || player4.bets !== 2000 || player5.bets !== 1500) {
        passed = false;
    }

    return new TestResult(passed, "conductBetsTest01. Pot = " + table.pot + ", table.maxCurrentRoundBet "
        + table.maxCurrentRoundBet + ", Player0.status = " + player0.status + ", Player01.status = " + player1.status +
        ", Player02.status = " + player2.status + ", Player03.status = " + player3.status + "Player04.status = " + player4.status +
        ", Player05.status = " + player5.status + ", Player0.bets = " + player0.bets + ", Player01.bets = " + player1.bets + ", Player02.bets = " + player2.bets + ", Player03.bets = " + player3.bets + ", Player04.bets = " + player4.bets + ", Player05.bets = " + player5.bets);

}

function startingBetTest01 () {
    var table = new Table(1);
    var player0 = table.players.getPlayerAt(0);
    player0.addUser({name: "u0", balance: 10000});
    player0.actionCounter = 0;
    player0.receive = function() {
        var actions = [
            {action: "CHECK", betAmount: 0},
            {action: "CHECK", betAmount: 0},
        ];
        return actions[player0.actionCounter++];
    };
    player0.user.socket = {};
    player0.user.socket.emit = function () {};

    this.startBetting(1000);
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
    testResults.push(conductIndividualBetFoldTest01());
    testResults.push(conductIndividualBetFoldTest02());
    testResults.push(conductIndividualBetCheckTest01());
    testResults.push(conductIndividualBetCheckTest02());
    testResults.push(conductIndividualBetCheckTest03());
    testResults.push(conductIndividualBetAllinTest01());
    testResults.push(conductIndividualBetAllinTest02());
    testResults.push(conductIndividualBetAllinTest03());
    testResults.push(conductBetsTest01());

    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
