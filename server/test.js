var table = require('./table');

function testCase01(table) {
    var array = table.players.players;
    for (var i = 0; i < array.length; i++) {
        array[i].user = {balance: 10000};
        array[i].status = "ACTIVE";
    }
    table.bigBlindAmount = 200;
    table.smallBlindAmount = 100;
}

module.exports = {
    testCase01 : testCase01
};
