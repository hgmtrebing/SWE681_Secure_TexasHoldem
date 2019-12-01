const SystemLog =require('../model/SystemLog');

function Log() {

    this.logGame = function(tableId, roundId, msg) {
        console.log("[ Game Log, Table " + tableId + " " + roundId + " : " + new Date() + "] " + msg);
    };

    this.logGameError = function(tableId, roundId, msg) {
        console.log("[ Game ERROR, Table " + tableId + " " + roundId + " : " + new Date() + "] " + msg);
    };

    this.logSystem = function (msg) {
        console.log("[ System Log: " + new Date() + "] " + msg);
        let systemlog = new SystemLog({message: msg});
        systemlog.save(function(err){
            if(err){
                console.log("[ System Loggin erro: " + new Date() + "] " + msg);
            }
        });
    };

    this.logSystemError = function(msg) {
        console.log("[ System ERROR: " + new Date() + "] " + msg);
        let systemlog = new SystemLog({type: 'Error', message: msg});
        systemlog.save(function(err){
            if(err){
                console.log("[ System Logging Error: " + new Date() + "] " + msg);
            }
        });
    };
}

module.exports = {
    Log : Log
};
