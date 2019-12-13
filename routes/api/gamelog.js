const express = require("express");
const router = express.Router();
const Log = require('../../server/log.js').Log;
const GameLog = require("../../model/GameLog");
const Validator = require('./../../input-validators/validators').inputValidators;
let middleware = require('./../../middleware');

router.get("/:userId/getGameLogData",middleware.verifyToken, function(req,res){
    let syslog = new Log();
    let userId= req.params.userId;
    GameLog.find({ UserId: userId },{'_id':0, 'tableId':1, 'roundId':1, 'move':1},{sort:{'tableId':1,'roundId':1}}, function (err, gamelog) {
        if (err) {
            syslog.logSystemError(err.message);
            res.send({
                success: false,
                message: "Something went wrong. Please try again later."
            });
        }
        if(gamelog){
            res.send({success:true, data:gamelog});
        }
    });
    
});

module.exports = router;