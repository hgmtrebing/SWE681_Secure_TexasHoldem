const SystemLog =require('../model/SystemLog');
const GameLog = require('../model/GameLog');
const GameErrorLog = require('../model/GameErrorLog');

function Log() {

    this.logGame = function(userId, userName,tableId, roundId, msg) {
        console.log("[ Game Log, Table " + tableId + " " + roundId + " : " + new Date() + "] " + msg);
       let gamelog = new GameLog({
        UserId: userId,
        username: userName,
        tableId: tableId,
        roundId: roundId,
        move:msg
       });
       gamelog.save(function(err){
        if(err){
            console.log("[ Game Error: " + new Date() + "] " + msg);
        }
    });
    };

    this.logGameError = function(userName, tableId, roundId, msg) {
        console.log("[ Game ERROR, Table " + tableId + " " + roundId + " : " + new Date() + "] " + msg);
        let gameErrorlog = new GameErrorLog({
            username: userName,
            tableId: tableId,
            roundId: roundId,
            message:msg
           });
           gameErrorlog.save(function(err){
            if(err){
                console.log("[ Game Error: " + new Date() + "] " + msg);
            }
        });

    };

    this.logSystem = function (msg) {
        console.log("[ System Log: " + new Date() + "] " + msg);
        let systemlog = new SystemLog({message: msg});
        systemlog.save(function(err){
            if(err){
                console.log("[ System Logging error: " + new Date() + "] " + msg);
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
