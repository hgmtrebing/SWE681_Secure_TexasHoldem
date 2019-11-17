var table = require('./table');

function setup(table) {
    var array = table.players.players;
    for (var i = 0; i < array.length; i++) {
        array[i].user = {balance: 10000};
        array[i].status = "ACTIVE";
    }
    table.bigBlindAmount = 200;
    table.smallBlindAmount = 100;
}

module.exports = {
    setup : setup
}