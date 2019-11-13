const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../../model/User");
const config = require('../../config');

// @route POST api/users/register
router.post("/new-user", function (req, res) {
    User.findOne({username : req.body.username}, function(err, user){
        if (err) {
            res.send({
                success: false,
                message: 'Something went wrong'
            });
        }
        if(user){
            res.send({
                success:false,
                message:'User name already exist'
            });
        }else{
            let user = new User({
                username: req.body.username,
                password: req.body.password
            })
            user.save(function(err, usr) {
                if(err){
                    res.send({
                        success:false,
                        message: err.message
                    })
                }else{
                    res.send({
                        success:true,
                        username: user.username,
                        message: 'User Successfully Created'
                    });
                }
            });
        }
    });
  
});

// @route POST api/users/register
router.post("/login", function (req, res) {
    //userservice.login(req.body.username, req.body.password).then((result) => res.send(result));
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.send({
                success: false,
                message: 'Something went wrong'
            });
        }
        if (user) {
            user.comparePassword(req.body.password, (err, match) => {
                if (err) {
                    res.send({
                        success: false,
                        message: 'Invalid Username and Password'
                    });
                }
                const token = jwt.sign({ "username": user.username, "password": user.password }, config.secretKey, { expiresIn: '12h' })
                res.send({
                    success: true,
                    token: token,
                    username: user.username,
                    message: 'Successfully logged in'
                });
            });
        } else {
            res.send({
                success: false,
                message: 'Invalid Username and Password'
            });
        }
    });
});

module.exports = router;

