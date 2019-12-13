/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

var carddeck = require('../server/carddeck');
var Rank = carddeck.Rank;
var Ranks = carddeck.Ranks;
var Suite = carddeck.Suite;
var Suites = carddeck.Suites;
var Card = carddeck.Card;
var CardDeck = carddeck.CardDeck;
var TestResult = require('./TestResult').TestResult;

function deckCount01 () {
    var d = new CardDeck();
    if (d.deck.length === 52) {
        return new TestResult(true, "deckCount01. CardDeck has exactly 52 cards");
    } else {
        return new TestResult(false, "deckCount01. CardDeck has " + d.deck.length + " cards.");
    }
}

function deckSuiteCount01() {
    var d = new CardDeck();
    var counts = {};
    for (var i = 0; i < d.deck.length; i++) {
        if (d.deck[i].suite in counts) {
            counts[d.deck[i].suite]++;
        } else {
            counts[d.deck[i].suite] = 1;
        }
    }

    var result = true;
    var returnString = "deckSuiteCount01. ";
    for (var suite in counts) {
        if (counts[suite] !== 13) {
            result = false;
        }
        returnString += suite.toString() + " count: " + counts[suite] + ". ";
    }
    return new TestResult(result, returnString);
}

function deckRankCount01 () {
    var d = new CardDeck();
    var counts = {};
    for (card in d.deck) {
        if (d.deck[card].rank in counts) {
            counts[d.deck[card].rank]++;
        } else {
            counts[d.deck[card].rank] = 1;
        }
    }

    var passed = true;
    var message = "deckRankCount01. ";
    for (rank in counts) {
        if (counts[rank] !== 4) {
            passed = false;
        }
        message += rank.toString() + " count: " + counts[rank] + ". ";
    }
    return new TestResult(passed, message);
}

function runAllTests() {
    var testResults = [];
    testResults.push(deckCount01());
    testResults.push(deckSuiteCount01());
    testResults.push(deckRankCount01());

    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
