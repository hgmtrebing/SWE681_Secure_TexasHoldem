/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

$(document).ready(function () {
    $("#login").click(function () {
        window.location.replace("/login");
    });

    $("#create-account").click(function () {
        window.location.replace("/create-account");
    });
}); 
