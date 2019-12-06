const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../../model/User");
const config = require('../../config');
const Log = require('../../server/log.js').Log;
const Validator = require('./../../input-validators/validators').inputValidators;
let middleware = require('./../../middleware');

// @route POST api/users/register
router.post("/new-user", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let syslog = new Log();
    let validator = new Validator();
    if (!validator.validateUsername(username) || !validator.validatePassword(password)) {
        syslog.logSystem("Invalid register attemt. Invalid username or password");
        res.send({
            success: false,
            message: 'Invalid Username or Password.'
        });
    } else {

        // validate the user input first
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                syslog.logSystemError(err.message);
                res.send({
                    success: false,
                    message: "Something went wrong. Please try again later."
                });
            }
            if (user) {
                syslog.logSystem("Invalid register. Username: " + user.username + " already exists.")
                res.send({
                    success: false,
                    message: 'User name already exist'
                });
            } else {
                let user = new User({
                    username,
                    password
                })
                user.save(function (err, usr) {
                    if (err) {
                        syslog.logSystemError(err.message);
                        res.send({
                            success: false,
                            message: "Something went wrong. Please try again later."
                        })
                    } else {
                        syslog.logSystem("User: " + user.username + " Successfully Created")
                        res.send({
                            success: true,
                            username: user.username,
                            message: 'User Successfully Created'
                        });
                    }
                });
            }
        });
    }


});

// @route POST api/user/register
router.post("/login", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let syslog = new Log();
    let validator = new Validator();
    if (!validator.validateUsername(username) || !validator.validatePassword(password)) {
        syslog.logSystem("Invalid login attempt. Invalid username or password");
        res.send({
            success: false,
            message: 'Invalid Username or Password.'
        });
    } else {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                syslog.logSystemError(err.message);
                res.send({
                    success: false,
                    message: "Something went wrong. Please try again later."
                });
            }
            if (user) {
                user.comparePassword(password, (err, match) => {
                    if (err) {
                        syslog.logSystemError(err.message);
                        res.send({
                            success: false,
                            message: "Something went wrong. Please try again later."
                        });
                    }
                    if (match) { //password match
                        const token = jwt.sign({ "username": user.username, "password": user.password }, config.secretKey, { expiresIn: '12h' })
                        syslog.logSystem(user.username + "Successfully logged in.");
                        res.send({
                            success: true,
                            token: token,
                            userId: user._id,
                            username: user.username,
                            message: 'Successfully logged in'
                        });
                    } else { //password mis-match

                        syslog.logSystem("Login failed. Password mismatch for " + user.username + ". Attempted Password: " + password);
                        res.send({
                            success: false,
                            username: user.username,
                            message: 'Invalid Username and Password'
                        });
                    }
                });
            } else {

                //log this data of login failure -- username invalid
                syslog.logSystem("Unable to find the username: " + username + " in the DB.");
                res.send({
                    success: false,
                    message: 'Invalid Username and Password'
                });
            }
        });

    }

});

router.post("/logout", function (req, res) {
    ///what do we do here
});

router.get("/profile/:userId",middleware.verifyToken, function(req,res){
    let userId= req.params.userId;
    User.findById(userId,{'_id':0, 'username':1, 'balance':1, 'win':1, 'tie':1, 'GamePlayed':1, 'loss':1}, function(err, user){
        if (err) {
            syslog.logSystemError(err.message);
            res.send({
                success: false,
                message: "Something went wrong. Please try again later."
            });
        }
        if(user){
            res.send(user);
        }
    })
});

module.exports = router;

