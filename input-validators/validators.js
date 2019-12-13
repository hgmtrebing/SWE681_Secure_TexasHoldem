/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

function inputValidators() {
    this.validateUsername = function(username){
        if(username === '' || username === null || username === undefined){
            return false;
        }
        let validUsername = /^[a-zA-Z0-9]{5,20}$/;
        return validUsername.test(username);
    },
    this.validatePassword= function(passwrd){
        if(passwrd === '' || passwrd === null || passwrd === undefined){
            return false;
        }
        let validPassword = /^([a-zA-Z0-9@_$*#!.]{8,20})$/; //need to change this later
        return validPassword.test(passwrd);
    }
}

module.exports ={
    inputValidators: inputValidators
}
