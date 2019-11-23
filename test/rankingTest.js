var ranking = require('../server/ranking');
var carddeck = require('../server/carddeck');
var TestResult = require('./TestResult').TestResult;
var Card = carddeck.Card;
var Ranks = carddeck.Ranks;
var Suites = carddeck.Suites;

function sortCardsByRankTest01 () {
    var cards = [
        new Card(Suites.CLUBS, Ranks.NINE),
        new Card(Suites.CLUBS, Ranks.TWO),
        new Card(Suites.CLUBS, Ranks.FIVE),
        new Card(Suites.CLUBS, Ranks.THREE),
        new Card(Suites.CLUBS, Ranks.ACE)
    ];
    ranking.sortCardsByRank(cards);

    var passed = true;
    if (cards[0].rank !== Ranks.TWO ||
        cards[1].rank !== Ranks.THREE ||
        cards[2].rank !== Ranks.FIVE ||
        cards[3].rank !== Ranks.NINE ||
        cards[4].rank !== Ranks.ACE ) {
        passed = false;
    }

    return new TestResult(passed, "sortCardRanksTest01. Card Order: " + cards[0].toString() + ", " +
    cards[1].toString() + ", " + cards[2].toString() + ", " + cards[3].toString() + ", " + cards[4].toString());
}

function sortCardsByRankTest02 () {
    var cards = [
        new Card(Suites.DIAMONDS, Ranks.TWO),
        new Card(Suites.DIAMONDS, Ranks.ACE),
        new Card(Suites.CLUBS, Ranks.THREE),
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.HEARTS, Ranks.FOUR),
        new Card(Suites.HEARTS, Ranks.JACK),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.TEN)
    ];
    ranking.sortCardsByRank(cards);

    var passed = true;
    if (cards[0].rank !== Ranks.TWO ||
        cards[1].rank !== Ranks.THREE ||
        cards[2].rank !== Ranks.FOUR ||
        cards[3].rank !== Ranks.FIVE ||
        cards[4].rank !== Ranks.TEN ||
        cards[5].rank !== Ranks.JACK ||
        cards[6].rank !== Ranks.KING ||
        cards[7].rank !== Ranks.ACE ) {
        passed = false;
    }

    return new TestResult(passed, "sortCardRanksTest01. Card Order: " + cards[0].toString() + ", " +
        cards[1].toString() + ", " + cards[2].toString() + ", " + cards[3].toString() + ", " + cards[4].toString() + ", " +
        cards[5].toString() + ", " + cards[6].toString() + ", " + cards[7].toString() );
}

function countCardsByRankTest01() {
    cards = [
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.CLUBS, Ranks.ACE),
        new Card(Suites.CLUBS, Ranks.JACK),
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.DIAMONDS, Ranks.FIVE),
        new Card(Suites.HEARTS, Ranks.ACE),
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.CLUBS, Ranks.FIVE),
        new Card(Suites.DIAMONDS, Ranks.ACE),
        new Card(Suites.HEARTS, Ranks.FIVE)
    ];

    var results = ranking.countCardsByRank(cards);
    var passed = true;
    if (results[Ranks.TWO] !== 2 ||
        results[Ranks.FIVE] !== 4 ||
        results[Ranks.JACK] !== 1 ||
        results[Ranks.ACE] !== 3 ) {
        passed = false;
    }
    return new TestResult(passed, "countCardsByRankTest01. Card Counts: " + Ranks.TWO.toString() + ": " + results[Ranks.TWO] + ", " +
    Ranks.FIVE.toString() + ": " + results[Ranks.FIVE] + ", " + Ranks.JACK.toString() + ": " + results[Ranks.JACK] + ", " +
    Ranks.ACE.toString() + ": " + results[Ranks.ACE] );

}

function runAllTests() {
    var testResults = [];
    testResults.push(sortCardsByRankTest01());
    testResults.push(sortCardsByRankTest02());
    testResults.push(countCardsByRankTest01());


    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
