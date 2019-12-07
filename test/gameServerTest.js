const GameServer = require('../server/game_server').GameServer;
const TestResult = require('./TestResult').TestResult;

function homePageMessageTest01 () {
    var server = new GameServer(null);
    server.createTable();
    server.createTable();
    var msg = server.createHomePageUpdateMessage();

    var a = msg.length === 2;
    var b = msg[0].tableId === 0;
    var c = msg[0].tableName === "table#0";
    var d = msg[0].players === 0;
    var e = msg[0].joinAllowed === true;
    var f = msg[1].tableId === 1;
    var g = msg[1].tableName === "table#1";
    var h = msg[1].players === 0;
    var i = msg[1].joinAllowed === true;

    var passed = false;
    if (a && b && c && d && e && f && g && h && i) {
        passed = true;
    }

    return new TestResult(passed, "homePageMessageTest01");
}

function runAllTests () {
    var testResults = [];
    testResults.push(homePageMessageTest01());

    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
