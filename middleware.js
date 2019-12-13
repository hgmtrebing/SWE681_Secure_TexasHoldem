/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

const jwt = require("jsonwebtoken");
const config = require('./config.js');
/*
Middleware to verify token for every request once the user have logged in and have the assigned token
*/
let verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token){
        if(token.startsWith('Bearer ')){
            token = token.slice(7, token.length); //remove bearer from token
        }
        jwt.verify(token, config.secretKey, (err, decoded) => {
            if(err){
                return res.json({
                    success:false,
                    message: 'Invalid Token'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        return res.json({
            success:false,
            message: 'Missing Token'
        });
    }

};

module.exports = {
    verifyToken : verifyToken
};
