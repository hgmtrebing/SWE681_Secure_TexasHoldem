
function Log() {

    this.logGame = function(tableId, roundId, msg) {
        console.log("[ Game Log, Table " + tableId + " " + roundId + " : " + new Date() + "] " + msg);
    };

    this.logGameError = function(tableId, roundId, msg) {
        console.log("[ Game ERROR, Table " + tableId + " " + roundId + " : " + new Date() + "] " + msg);
    };

    this.logSystem = function (msg) {
        console.log("[ System Log: " + new Date() + "] " + msg);
    };

    this.logSystemError = function(msg) {
        console.log("[ System ERROR: " + new Date() + "] " + msg);
    };
}

module.exports = {
    Log : Log
};
