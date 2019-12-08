const TestResult = require('./TestResult').TestResult;
const Table = require('../server/table').Table;
const defines = require('../server/definition');
const Card = require('../server/carddeck').Card;
const Messages = require('../server/messages');

function appendToString(origString, fieldName, result) {
    return origString + ", " + fieldName + " : " + result;
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

function conductIndividualBetCallTest01 () {
    var table = new Table(1);
    var player = table.players.getPlayerAt(0);
    player.addUser ({username: "u0", balance: 10000});
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
    player.addUser ({username: "u0", balance: 1000});
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
    player.addUser({username: "u0", balance: 0});
    player.receive = function () {
        return {action: "CALL", betAmount: 0};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 0;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 0 || player.bets !== 0 || player.currentRoundBet !== 0 || player.status !== defines.Status.ALLIN ||
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
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
    player.addUser({username: "u0", balance: 10000});
    player.receive = function() {
        return {action: "ALLIN", betAmount: 0};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 250;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 10000 || table.maxCurrentRoundBet !== 10000 || player.bets !== 10000 ||
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
    player.addUser({username: "u0", balance: 10000});
    player.receive = function() {
        return {action: "ALLIN", betAmount: 500};
    };
    player.user.socket = {};
    player.user.socket.emit = function () {};
    table.setupTable();
    table.maxCurrentRoundBet = 13000;
    table.conductIndividualBet(0);

    var passed = true;
    if (table.pot !== 10000 || table.maxCurrentRoundBet !== 13000 || player.bets !== 10000 ||
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
    player.addUser({username: "u0", balance: 10000});
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
    if (table.pot !== 10000 || table.maxCurrentRoundBet !== 13000 || player.bets !== 11000 ||
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
    player0.addUser({username: "u0", balance: 10000});
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
    player1.addUser({username: "u0", balance: 10000});
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
    player2.addUser({username: "u0", balance: 10000});
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
    player3.addUser({username: "u0", balance: 10000});
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
    player4.addUser({username: "u0", balance: 10000});
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
    player5.addUser({username: "u0", balance: 10000});
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
    player0.addUser({username: "u0", balance: 10000});
    player0.currentAction = {action: defines.Actions.CALL, betAmount: 1000};
    player0.user.socket = {};
    player0.user.socket.emit = function () {};
    table.setupTable();

    table.startBetting(1000);
    table.conductNextBet();

    returnString = "startingBetTest01. ";
    var a = player0.user.balance === 9000;
    returnString = appendToString(returnString, "player0.user.balance === 9000;", a);
    var b = player0.status === defines.Status.ACTIVE;
    returnString = appendToString(returnString, "player0.status === defines.Status.ACTIVE;", b);
    var c = player0.lastAction.action === defines.Actions.CALL;
    returnString = appendToString(returnString, "player0.lastAction === defines.Actions.CALL;", c);
    var d = player0.currentAction === null;
    returnString = appendToString(returnString, "player0.currentAction === null;", d);
    var e = player0.bets === 1000;
    returnString = appendToString(returnString, "player0.bets === 1000;", e);
    var f = player0.currentRoundBet === 1000;
    returnString = appendToString(returnString, "player0.currentRoundBet === 1000;", f);
    var g = table.waitingForInput === false;
    returnString = appendToString(returnString, "table.waitingForInput === false;", g);
    var h = table.conductingBets === true;
    returnString = appendToString(returnString, "table.conductingBets === true;", h);
    var i = table.userTimeoutCounter === 0;
    returnString = appendToString(returnString, "table.userTimeoutCounter = 0;", i);
    var j = table.userTimeoutFunction === null;
    returnString = appendToString(returnString, "table.userTimeoutFunction = null;", j);
    var k = table.pot === 1000;
    returnString = appendToString(returnString, "table.pot === 1000;", k);
    var l = table.lastPlayer === 0;
    returnString = appendToString(returnString, "table.lastPlayer === 0;", l);
    var m = table.currentPlayer === 1;
    returnString = appendToString(returnString, "table.currentPlayer === 1;", m);

    var passed = false;
    if (a && b && c && d && e && f && g && h && i && j && k && l && m) {
        passed = true;
    }
    return new TestResult(passed, returnString);
}

function startingBetTest02 () {
    var table = new Table(1);
    var player0 = table.players.getPlayerAt(3);
    player0.addUser({username: "u0", balance: 10000});
    player0.currentAction = {action: defines.Actions.CALL, betAmount: 1000};
    player0.user.socket = {};
    player0.user.socket.emit = function () {};
    table.setupTable();

    table.startBetting(1000);
    table.conductNextBet();
    table.conductNextBet();

    returnString = "startingBetTest02. ";
    var a = player0.user.balance === 10000;
    returnString = appendToString(returnString, "player0.user.balance === 10000;", a);
    var b = player0.status === defines.Status.ACTIVE;
    returnString = appendToString(returnString, "player0.status === defines.Status.ACTIVE;", b);
    var c = player0.lastAction.action === defines.Actions.UNDEFINED;
    returnString = appendToString(returnString, "player0.lastAction.action === defines.Actions.UNDEFINED;", c);
    var d = player0.currentAction.action === defines.Actions.CALL;
    returnString = appendToString(returnString, "player0.currentAction.action === defines.Actions.CALL;", d);
    var e = player0.bets === 0;
    returnString = appendToString(returnString, "player0.bets === 0;", e);
    var f = player0.currentRoundBet === 0;
    returnString = appendToString(returnString, "player0.currentRoundBet === 0;", f);
    var g = table.waitingForInput === false;
    returnString = appendToString(returnString, "table.waitingForInput === false;", g);
    var h = table.conductingBets === true;
    returnString = appendToString(returnString, "table.conductingBets === true;", h);
    var i = table.userTimeoutCounter === 0;
    returnString = appendToString(returnString, "table.userTimeoutCounter = 0;", i);
    var j = table.userTimeoutFunction === null;
    returnString = appendToString(returnString, "table.userTimeoutFunction = null;", j);
    var k = table.pot === 0;
    returnString = appendToString(returnString, "table.pot === 0;", k);
    var l = table.lastPlayer === 0;
    returnString = appendToString(returnString, "table.lastPlayer === 0;", l);
    var m = table.currentPlayer === 2;
    returnString = appendToString(returnString, "table.currentPlayer === 2;", m);

    var passed = false;
    if (a && b && c && d && e && f && g && h && i && j && k && l && m) {
        passed = true;
    }
    return new TestResult(passed, returnString);
}

function startingBetTest03 () {
    var table = new Table(1);
    var player0 = table.players.getPlayerAt(3);
    player0.addUser({username: "u0", balance: 10000});
    player0.currentAction = {action: defines.Actions.CALL, betAmount: 1000};
    player0.user.socket = {};
    player0.user.socket.emit = function () {};
    table.setupTable();

    table.startBetting(0);
    table.conductNextBet();
    table.conductNextBet();
    table.conductNextBet();
    table.conductNextBet();

    returnString = "startingBetTest03. ";
    var a = player0.user.balance === 10000;
    returnString = appendToString(returnString, "player0.user.balance === 10000;", a);
    var b = player0.status === defines.Status.ACTIVE;
    returnString = appendToString(returnString, "player0.status === defines.Status.ACTIVE;", b);
    var c = player0.lastAction.action === defines.Actions.CALL;
    returnString = appendToString(returnString, "player0.lastAction.action === defines.Actions.CALL;", c);
    var d = player0.currentAction === null;
    returnString = appendToString(returnString, "player0.currentAction.action === null;", d);
    var e = player0.bets === 0;
    returnString = appendToString(returnString, "player0.bets === 0;", e);
    var f = player0.currentRoundBet === 0;
    returnString = appendToString(returnString, "player0.currentRoundBet === 0;", f);
    var g = table.waitingForInput === false;
    returnString = appendToString(returnString, "table.waitingForInput === false;", g);
    var h = table.conductingBets === true;
    returnString = appendToString(returnString, "table.conductingBets === true;", h);
    var i = table.userTimeoutCounter === 0;
    returnString = appendToString(returnString, "table.userTimeoutCounter = 0;", i);
    var j = table.userTimeoutFunction === null;
    returnString = appendToString(returnString, "table.userTimeoutFunction = null;", j);
    var k = table.pot === 0;
    returnString = appendToString(returnString, "table.pot === 0;", k);
    var l = table.lastPlayer === 0;
    returnString = appendToString(returnString, "table.lastPlayer === 0;", l);
    var m = table.currentPlayer === 4;
    returnString = appendToString(returnString, "table.currentPlayer === 4;", m);

    var passed = false;
    if (a && b && c && d && e && f && g && h && i && j && k && l && m) {
        passed = true;
    }
    return new TestResult(passed, returnString);
}


function startingBetTest04 () {
    var table = new Table(1);
    var player0 = table.players.getPlayerAt(0);
    player0.addUser({username: "u0", balance: 10000});
    player0.currentAction = {action: defines.Actions.CHECK, betAmount: 0};
    player0.user.socket = {};
    player0.user.socket.emit = function () {};

    var player1 = table.players.getPlayerAt(1);
    player1.addUser({username: "u1", balance: 10000});
    player1.currentAction = {action: defines.Actions.RAISE, betAmount: 1500};
    player1.user.socket = {};
    player1.user.socket.emit = function () {};

    var player2 = table.players.getPlayerAt(2);
    player2.addUser({username: "u2", balance: 10000});
    player2.currentAction = {action: defines.Actions.FOLD, betAmount: 0};
    player2.user.socket = {};
    player2.user.socket.emit = function () {};

    var player3 = table.players.getPlayerAt(3);
    player3.addUser({username: "u3", balance: 10000});
    player3.currentAction = {action: defines.Actions.CALL, betAmount: 1500};
    player3.user.socket = {};
    player3.user.socket.emit = function () {};

    table.setupTable();
    table.startBetting(0);
    table.conductNextBet();
    table.conductNextBet();
    table.conductNextBet();
    table.conductNextBet();

    returnString = "startingBetTest04. ";
    var a = player0.user.balance === 10000;
    returnString = appendToString(returnString, "player0.user.balance === 10000;", a);
    var b = player0.status === defines.Status.ACTIVE;
    returnString = appendToString(returnString, "player0.status === defines.Status.ACTIVE;", b);
    var c = player0.lastAction.action === defines.Actions.CHECK;
    returnString = appendToString(returnString, "player0.lastAction.action === defines.Actions.CHECK;", c);
    var d = player0.currentAction === null;
    returnString = appendToString(returnString, "player0.currentAction.action === null;", d);
    var e = player0.bets === 0;
    returnString = appendToString(returnString, "player0.bets === 0;", e);
    var f = player0.currentRoundBet === 0;
    returnString = appendToString(returnString, "player0.currentRoundBet === 0;", f);

    var a1 = player1.user.balance === 8500;
    returnString = appendToString(returnString, "player1.user.balance === 8500;", a);
    var b1 = player1.status === defines.Status.ACTIVE;
    returnString = appendToString(returnString, "player1.status === defines.Status.ACTIVE;", b);
    var c1 = player1.lastAction.action === defines.Actions.RAISE;
    returnString = appendToString(returnString, "player1.lastAction.action === defines.Actions.RAISE;", c);
    var d1 = player1.currentAction === null;
    returnString = appendToString(returnString, "player1.currentAction.action === null;", d);
    var e1 = player1.bets === 1500;
    returnString = appendToString(returnString, "player1.bets === 1500;", e);
    var f1 = player1.currentRoundBet === 1500;
    returnString = appendToString(returnString, "player1.currentRoundBet === 1500;", f);

    var a2 = player2.user.balance === 10000;
    returnString = appendToString(returnString, "player2.user.balance === 10000;", a);
    var b2 = player2.status === defines.Status.FOLDED;
    returnString = appendToString(returnString, "player2.status === defines.Status.FOLDED;", b);
    var c2 = player2.lastAction.action === defines.Actions.FOLD;
    returnString = appendToString(returnString, "player2.lastAction.action === defines.Actions.FOLD;", c);
    var d2 = player2.currentAction === null;
    returnString = appendToString(returnString, "player2.currentAction.action === null;", d);
    var e2 = player2.bets === 0;
    returnString = appendToString(returnString, "player2.bets === 0;", e);
    var f2 = player2.currentRoundBet === 0;

    var a3 = player3.user.balance === 8500;
    returnString = appendToString(returnString, "player3.user.balance === 8500;", a);
    var b3 = player3.status === defines.Status.ACTIVE;
    returnString = appendToString(returnString, "player3.status === defines.Status.ACTIVE;", b);
    var c3 = player3.lastAction.action === defines.Actions.CALL;
    returnString = appendToString(returnString, "player3.lastAction.action === defines.Actions.CALL;", c);
    var d3 = player3.currentAction === null;
    returnString = appendToString(returnString, "player3.currentAction.action === null;", d);
    var e3 = player3.bets === 1500;
    returnString = appendToString(returnString, "player3.bets === 0;", e);
    var f3 = player3.currentRoundBet === 1500;

    var g = table.waitingForInput === false;
    returnString = appendToString(returnString, "table.waitingForInput === false;", g);
    var h = table.conductingBets === true;
    returnString = appendToString(returnString, "table.conductingBets === true;", h);
    var i = table.userTimeoutCounter === 0;
    returnString = appendToString(returnString, "table.userTimeoutCounter = 0;", i);
    var j = table.userTimeoutFunction === null;
    returnString = appendToString(returnString, "table.userTimeoutFunction = null;", j);
    var k = table.pot === 3000;
    returnString = appendToString(returnString, "table.pot === 3000;", k);
    var l = table.lastPlayer === 1;
    returnString = appendToString(returnString, "table.lastPlayer === 1;", l);
    var m = table.currentPlayer === 4;
    returnString = appendToString(returnString, "table.currentPlayer === 4;", m);

    var passed = false;
    if (a && b && c && d && e && f && g && h && i && j && k && l && m && a1 && b1 && c1 && d1 && e1 && f1 && a2 && b2 &&
    c2 && d2 && e2 && f2 && a3 && b3 && c3 && d3 && e3 && f3) {
        passed = true;
    }
    return new TestResult(passed, returnString);
}

function nextTest01 () {
    var table = new Table(3);
    table.players.waitingUsers.push({username: "u0", balance: 10000, socket: {emit: function () {}}});
    table.players.waitingUsers.push({username: "u1", balance: 10000, socket: {emit: function () {}}});
    table.players.waitingUsers.push({username: "u2", balance: 10000, socket: {emit: function () {}}});
    table.players.waitingUsers.push({username: "u3", balance: 10000, socket: {emit: function () {}}});
    table.players.waitingUsers.push({username: "u4", balance: 10000, socket: {emit: function () {}}});
    table.players.waitingUsers.push({username: "u5", balance: 10000, socket: {emit: function () {}}});
    table.bigBlindAmount = 200;
    table.smallBlindAmount = 100;


    table.next();


    var str = "nextTest01. ";
    var a1 = table.round === defines.Rounds.SETUP;
    str = appendToString(str, "table.round === defines.Rounds.SETUP;", a1);
    var a2 = table.players.getNumberOfPlayers(defines.Status.EMPTY, true) === 0;
    str = appendToString(str, "table.players.getNumberOfPlayers(defines.Status.EMPTY, false) === 0;", a2);
    var a3 = table.players.getNumberOfPlayers(defines.Status.ACTIVE, true) === 6;
    str = appendToString(str,  "table.players.getNumberOfPlayers(defines.Status.ACTIVE, true) === 6;", a3);

    table.next();


    // At the conclusion of setup
    var b1 = table.round === defines.Rounds.BET;
    str = appendToString(str, "table.round === defines.Rounds.BET;", b1);
    var b2 = table.players.getNumberOfPlayers(defines.Status.EMPTY, true) === 0;
    str = appendToString(str, "table.players.getNumberOfPlayers(defines.Status.EMPTY, false) === 0;", b2);
    var b3 = table.players.getNumberOfPlayers(defines.Status.ACTIVE, true) === 6;
    str = appendToString(str,  "table.players.getNumberOfPlayers(defines.Status.ACTIVE, true) === 6;", b3);
    var b4 = table.players.players[0].cardA instanceof Card;
    str = appendToString(str,"table.players[0].cardA instanceof Card;", b4 );
    var b5 = table.players.players[0].cardB instanceof Card;
    str = appendToString(str,"table.players[0].cardB instanceof Card;", b5 );
    var b6 = table.players.players[1].cardA instanceof Card;
    str = appendToString(str,"table.players[1].cardA instanceof Card;", b6 );
    var b7 = table.players.players[1].cardB instanceof Card;
    str = appendToString(str,"table.players[1].cardB instanceof Card;", b7 );
    var b8 = table.players.players[2].cardA instanceof Card;
    str = appendToString(str,"table.players[2].cardA instanceof Card;", b8 );
    var b9 = table.players.players[2].cardB instanceof Card;
    str = appendToString(str,"table.players[2].cardB instanceof Card;", b9 );
    var b10 = table.players.players[3].cardA instanceof Card;
    str = appendToString(str,"table.players[3].cardA instanceof Card;", b10 );
    var b11 = table.players.players[3].cardB instanceof Card;
    str = appendToString(str,"table.players[3].cardB instanceof Card;", b11 );
    var b12 = table.players.players[4].cardA instanceof Card;
    str = appendToString(str,"table.players[4].cardA instanceof Card;", b12 );
    var b13 = table.players.players[4].cardB instanceof Card;
    str = appendToString(str,"table.players[4].cardB instanceof Card;", b13 );
    var b14 = table.players.players[5].cardA instanceof Card;
    str = appendToString(str,"table.players[5].cardA instanceof Card;", b14 );
    var b15 = table.players.players[5].cardB instanceof Card;
    str = appendToString(str,"table.players[5].cardB instanceof Card;", b15 );
    var b16 = table.flop[0] instanceof Card;
    str = appendToString(str,"table.flop[0] instanceof Card;", b16 );
    var b17 = table.flop[1] instanceof Card;
    str = appendToString(str,"table.flop[1] instanceof Card;", b17 );
    var b18 = table.flop[2] instanceof Card;
    str = appendToString(str,"table.flop[2] instanceof Card;", b18 );
    var b19 = table.turn instanceof Card;
    str = appendToString(str,"table.turn instanceof Card;", b19 );
    var b20 = table.river instanceof Card;
    str = appendToString(str,"table.river instanceof Card;", b20 );

    // First Bet Round
    table.next();

    // Player 0 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u5", "", defines.Actions.CALL, 200));
    table.next();

    // Player 1 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u4", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 2 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u3", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 3 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u2", "", defines.Actions.CALL, 200));
    table.next();

    // Player 4 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u1", "", defines.Actions.CALL, 200));
    table.next();

    // Player 5 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u0", "", defines.Actions.FOLD, 0));
    table.next();


    // Flop Round------------------------------------
    table.next();

    // Player 0 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u5", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 1 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u4", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 2 folded
    table.next();

    // Player 3 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u2", "", defines.Actions.RAISE, 500));
    table.next();

    // Player 4 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u1", "", defines.Actions.RAISE, 700));
    table.next();

    // Player 5 folded
    table.next();

    // Player 0 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u5", "", defines.Actions.CALL, 700));
    table.next();

    // Player 1 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u4", "", defines.Actions.CALL, 700));
    table.next();

    // Player 2 folded
    table.next();

    // Player 3 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u2", "", defines.Actions.CALL, 700));
    table.next();

    table.next();
    table.next();
    table.next();

    // Player 0 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u5", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 1 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u4", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 2 folded
    table.next();

    // Player 3 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u2", "", defines.Actions.ALLIN, 0));
    table.next();

    // Player 4 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u1", "", defines.Actions.CALL, 9100));
    table.next();

    // Player 5 folded
    table.next();

    // Player 0 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u5", "", defines.Actions.ALLIN, 0));
    table.next();

    // Player 1 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u4", "", defines.Actions.CALL, 2000));
    table.next();

    table.next();
    table.next();


    // Player 0 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u5", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 1 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u4", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 2 folded
    table.next();

    // Player 3 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u2", "", defines.Actions.FOLD, 0));
    table.next();

    // Player 4 bets
    table.next();
    table.addMessage(new Messages.UserActionMessage("u1", "", defines.Actions.CHECK, 0));
    table.next();

    // Player 5 folded
    table.next();

    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();
    table.next();

    var c1 = table.round === defines.Rounds.FLOP;
    str = appendToString(str, "table.round === defines.Rounds.BET;", c1);

    var passed = false;
    if (a1 && a2 && a3 && b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9 && b10 && b11 && b12 && b13 && b14 && b15
    && b16 && b17 && b18 && b19 && b20 && c1) {
        passed = true;
    }
    return new TestResult(passed, str);
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
    testResults.push(startingBetTest01());
    testResults.push(startingBetTest02());
    testResults.push(startingBetTest03());
    testResults.push(startingBetTest04());
    testResults.push(nextTest01());

    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
