/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

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
    if (results[Ranks.TWO].count !== 2 ||
        results[Ranks.FIVE].count !== 4 ||
        results[Ranks.JACK].count !== 1 ||
        results[Ranks.ACE].count !== 3 ) {
        passed = false;
    }
    return new TestResult(passed, "countCardsByRankTest01. Card Counts: " + Ranks.TWO.toString() + ": " + results[Ranks.TWO].count + ", " +
    Ranks.FIVE.toString() + ": " + results[Ranks.FIVE].count + ", " + Ranks.JACK.toString() + ": " + results[Ranks.JACK].count + ", " +
    Ranks.ACE.toString() + ": " + results[Ranks.ACE].count );
}

function countCardsBySuiteTest01() {
    var cards = [
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.SPADES, Ranks.KING),
        new Card(Suites.CLUBS, Ranks.ACE),
        new Card(Suites.HEARTS, Ranks.ACE),
        new Card(Suites.CLUBS, Ranks.JACK),
        new Card(Suites.DIAMONDS, Ranks.KING),
        new Card(Suites.CLUBS, Ranks.QUEEN),
        new Card(Suites.DIAMONDS, Ranks.QUEEN),
        new Card(Suites.SPADES, Ranks.ACE),
        new Card(Suites.DIAMONDS, Ranks.ACE),
    ];

    var suiteCount = ranking.countCardsBySuite(cards);

    var passed = true;
    if (suiteCount[Suites.HEARTS].count !== 1 ||
        suiteCount[Suites.SPADES].count !== 2 ||
        suiteCount[Suites.DIAMONDS].count !== 3 ||
        suiteCount[Suites.CLUBS].count !== 4 ) {
        passed = false;
    }

    return new TestResult(passed, "countCardsBySuiteTest01. Card Counts = " + Suites.HEARTS.toString() + ": " +
    suiteCount[Suites.HEARTS].suite + ", " + Suites.SPADES.toString() + ": " + suiteCount[Suites.SPADES].suite + ", " +
    Suites.DIAMONDS.toString() + ": " + suiteCount[Suites.DIAMONDS].suite + ", " + Suites.CLUBS.toString() + ": " +
    suiteCount[Suites.CLUBS].suite);
}

function rankHandTest01() {
    var cards = [
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.DIAMONDS, Ranks.KING),
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.HEARTS, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.EIGHT),
        new Card(Suites.SPADES, Ranks.SEVEN),
        new Card(Suites.CLUBS, Ranks.JACK)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.PAIR || result[0].highCardRank !== Ranks.KING) {
        passed = false;
    }

    return new TestResult(passed, "rankHandTest01. " + result[0]);

}

function rankHandTest02() {
    var cards = [
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.DIAMONDS, Ranks.ACE),
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.HEARTS, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.SEVEN),
        new Card(Suites.CLUBS, Ranks.FIVE)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.THREE_OF_A_KIND || result[0].highCardRank !== Ranks.FIVE) {
        passed = false;
    }
    return new TestResult(passed, "rankHandTest02. " + result[0]);
}

function rankHandTest03() {
    var cards = [
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.DIAMONDS, Ranks.KING),
        new Card(Suites.HEARTS, Ranks.KING),
        new Card(Suites.HEARTS, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.KING),
        new Card(Suites.CLUBS, Ranks.FIVE)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.FOUR_OF_A_KIND || result[0].highCardRank !== Ranks.KING) {
        passed = false;
    }
    return new TestResult(passed, "rankHandTest03. " + result[0]);
}

/**
 * Tests whether rankHand() returns the correct result with two three-of-a-kind (the higher triplet should be returned)
 * @returns {module.exports.TestResult|TestResult}
 */
function rankHandTest04() {
    var cards = [
        new Card(Suites.HEARTS, Ranks.FIVE),
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.DIAMONDS, Ranks.KING),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.HEARTS, Ranks.KING),
        new Card(Suites.SPADES, Ranks.ACE),
        new Card(Suites.CLUBS, Ranks.FIVE)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.THREE_OF_A_KIND || result[0].highCardRank !== Ranks.KING) {
        passed = false;
    }
    return new TestResult(passed, "rankHandTest04. " + result[0]);
}

/**
 * Tests whether rankHand can adequately rank a Full House. This test includes two possible full house combos -
 * 3 Kings - 2 Fives and 3 Kings - 2 Twos. 3 Kings - 2 Fives is the correct result.
 * @returns {module.exports.TestResult|TestResult}
 */
function rankHandTest05() {
    var cards = [
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.DIAMONDS, Ranks.KING),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.HEARTS, Ranks.KING),
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.CLUBS, Ranks.FIVE)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.FULL_HOUSE || result[0].highCardRank !== Ranks.KING ||
        result[0].minorHighCardRank !== Ranks.FIVE) {
        passed = false;
    }
    return new TestResult(passed, "rankHandTest05. " + result[0]);
}

/**
 * Tests that rankHand() can adequately detect two pairs
 * @returns {module.exports.TestResult|TestResult}
 */
function rankHandTest06() {
    var cards = [
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.CLUBS, Ranks.KING),
        new Card(Suites.DIAMONDS, Ranks.KING),
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.HEARTS, Ranks.ACE),
        new Card(Suites.SPADES, Ranks.JACK),
        new Card(Suites.CLUBS, Ranks.EIGHT)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.TWO_PAIR || result[0].highCardRank !== Ranks.KING ||
        result[0].minorHighCardRank !== Ranks.TWO) {
        passed = false;
    }
    return new TestResult(passed, "rankHandTest06. " + result[0]);
}

function rankHandTest07() {
    var cards = [
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.HEARTS, Ranks.KING),
        new Card(Suites.HEARTS, Ranks.KING),
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.HEARTS, Ranks.ACE),
        new Card(Suites.SPADES, Ranks.EIGHT),
        new Card(Suites.CLUBS, Ranks.EIGHT)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.FLUSH || result[0].highCardRank !== Ranks.ACE ||
        result[0].minorHighCardRank !== Ranks.KING || result[0].minorHighCardRank2 !== Ranks.KING ||
        result[0].minorHighCardRank3 !== Ranks.TWO || result[0].minorHighCardRank4 !== Ranks.TWO) {
        passed = false;
    }
    return new TestResult(passed, "rankHandTest07. " + result[0]);
}

function rankHandTest08() {
    var cards = [
        new Card(Suites.SPADES, Ranks.ACE),
        new Card(Suites.HEARTS, Ranks.JACK),
        new Card(Suites.HEARTS, Ranks.TEN),
        new Card(Suites.HEARTS, Ranks.KING),
        new Card(Suites.HEARTS, Ranks.ACE),
        new Card(Suites.CLUBS, Ranks.ACE),
        new Card(Suites.HEARTS, Ranks.QUEEN)
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.ROYAL_FLUSH || result[0].highCardRank !== Ranks.ACE ||
        result[0].minorHighCardRank !== Ranks.KING || result[0].minorHighCardRank2 !== Ranks.QUEEN ||
        result[0].minorHighCardRank3 !== Ranks.JACK || result[0].minorHighCardRank4 !== Ranks.TEN) {
        passed = false;
    }

    return new TestResult(passed, "rankHandTest08. " + result[0]);
}

function rankHandTest09() {
    var cards = [
        new Card(Suites.SPADES, Ranks.SIX),
        new Card(Suites.SPADES, Ranks.FOUR),
        new Card(Suites.CLUBS, Ranks.SEVEN),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.EIGHT),
        new Card(Suites.HEARTS, Ranks.SEVEN),
        new Card(Suites.SPADES, Ranks.SEVEN),
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.STRAIGHT_FLUSH || result[0].highCardRank !== Ranks.EIGHT ||
        result[0].minorHighCardRank !== Ranks.SEVEN || result[0].minorHighCardRank2 !== Ranks.SIX ||
        result[0].minorHighCardRank3 !== Ranks.FIVE || result[0].minorHighCardRank4 !== Ranks.FOUR) {
        passed = false;
    }

    return new TestResult(passed, "rankHandTest09. " + result[0]);
}

function rankHandTest10() {
    var cards = [
        new Card(Suites.SPADES, Ranks.SIX),
        new Card(Suites.CLUBS, Ranks.FOUR),
        new Card(Suites.CLUBS, Ranks.SEVEN),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.HEARTS, Ranks.EIGHT),
        new Card(Suites.HEARTS, Ranks.SEVEN),
        new Card(Suites.DIAMONDS, Ranks.SEVEN),
    ];

    var result = ranking.rankHand(cards);
    var passed = true;
    if (result[0].ranking !== ranking.Rankings.STRAIGHT || result[0].highCardRank !== Ranks.EIGHT ||
        result[0].minorHighCardRank !== Ranks.SEVEN || result[0].minorHighCardRank2 !== Ranks.SIX ||
        result[0].minorHighCardRank3 !== Ranks.FIVE || result[0].minorHighCardRank4 !== Ranks.FOUR) {
        passed = false;
    }

    return new TestResult(passed, "rankHandTest09. " + result[0]);
}

function compareIndividualRankingTest01() {
    var ranking01 = new ranking.HandRanking(ranking.Rankings.ROYAL_FLUSH, Ranks.ACE);
    var ranking02 = new ranking.HandRanking(ranking.Rankings.ROYAL_FLUSH, Ranks.ACE);

    var result = ranking.compareIndividualRanking(ranking01, ranking02);
    var passed = true;
    if (result !== 0) {
        passed = false;
    }
    return new TestResult(passed, "compareIndividualRankingTest01. result = " + result);
}

function compareIndividualRankingTest02() {
    var ranking01 = new ranking.HandRanking(ranking.Rankings.ROYAL_FLUSH, Ranks.ACE);
    var ranking02 = new ranking.HandRanking(ranking.Rankings.STRAIGHT_FLUSH, Ranks.KING);

    var result = ranking.compareIndividualRanking(ranking01, ranking02);
    var passed = true;
    if (result <= 0) {
        passed = false;
    }
    return new TestResult(passed, "compareIndividualRankingTest02. result = " + result);
}

function compareIndividualRankingTest03() {
    var ranking01 = new ranking.HandRanking(ranking.Rankings.PAIR, Ranks.SEVEN);
    var ranking02 = new ranking.HandRanking(ranking.Rankings.PAIR, Ranks.TEN);

    var result = ranking.compareIndividualRanking(ranking01, ranking02);
    var passed = true;
    if (result >= 0) {
        passed = false;
    }
    return new TestResult(passed, "compareIndividualRankingTest03. result = " + result);
}

function compareIndividualRankingTest04() {
    var ranking01 = new ranking.HandRanking(ranking.Rankings.TWO_PAIR, Ranks.TEN, Ranks.SIX);
    var ranking02 = new ranking.HandRanking(ranking.Rankings.TWO_PAIR, Ranks.TEN, Ranks.SEVEN);

    var result = ranking.compareIndividualRanking(ranking01, ranking02);
    var passed = true;
    if (result >= 0) {
        passed = false;
    }
    return new TestResult(passed, "compareIndividualRankingTest04. result = " + result);
}

function compareIndividualRankingTest05() {
    var ranking01 = new ranking.HandRanking(ranking.Rankings.FULL_HOUSE, Ranks.TEN, Ranks.SIX);
    var ranking02 = new ranking.HandRanking(ranking.Rankings.FULL_HOUSE, Ranks.TEN, Ranks.SIX);

    var result = ranking.compareIndividualRanking(ranking01, ranking02);
    var passed = true;
    if (result !== 0) {
        passed = false;
    }
    return new TestResult(passed, "compareIndividualRankingTest05. result = " + result);
}

function compareIndividualRankingTest06() {
    var ranking01 = new ranking.HandRanking(ranking.Rankings.FLUSH, Ranks.TEN, Ranks.NINE, Ranks.EIGHT, Ranks.SEVEN, Ranks.SIX);
    var ranking02 = new ranking.HandRanking(ranking.Rankings.FLUSH, Ranks.TEN, Ranks.NINE, Ranks.EIGHT, Ranks.SEVEN, Ranks.FIVE);

    var result = ranking.compareIndividualRanking(ranking01, ranking02);
    var passed = true;
    if (result <= 0) {
        passed = false;
    }
    return new TestResult(passed, "compareIndividualRankingTest06. result = " + result);
}

function compareRankingsTest01() {
    var cards01 = [
        new Card(Suites.SPADES, Ranks.SIX),
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.SPADES, Ranks.QUEEN),
        new Card(Suites.SPADES, Ranks.KING),
        new Card(Suites.SPADES, Ranks.SEVEN),
        new Card(Suites.HEARTS, Ranks.SEVEN),
        new Card(Suites.DIAMONDS, Ranks.SEVEN),
    ];

    var cards02 = [
        new Card(Suites.SPADES, Ranks.SIX),
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.SPADES, Ranks.QUEEN),
        new Card(Suites.SPADES, Ranks.KING),
        new Card(Suites.SPADES, Ranks.SEVEN),
        new Card(Suites.HEARTS, Ranks.SEVEN),
        new Card(Suites.DIAMONDS, Ranks.SEVEN),
    ];

    var result = ranking.compareRankings(ranking.rankHand(cards01), ranking.rankHand(cards02));
    var passed = true;
    if (result !== 0) {
        passed = false;
    }

    return new TestResult(passed, "compareRankingsTest01. result = " + result);
}


function compareRankingsTest02() {
    var cards01 = [
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.SPADES, Ranks.QUEEN),
        new Card(Suites.SPADES, Ranks.KING),
        new Card(Suites.SPADES, Ranks.SEVEN),
        new Card(Suites.HEARTS, Ranks.SEVEN),
        new Card(Suites.DIAMONDS, Ranks.SEVEN),
    ];

    var cards02 = [
        new Card(Suites.SPADES, Ranks.SIX),
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.SPADES, Ranks.QUEEN),
        new Card(Suites.SPADES, Ranks.KING),
        new Card(Suites.SPADES, Ranks.SEVEN),
        new Card(Suites.HEARTS, Ranks.SEVEN),
        new Card(Suites.DIAMONDS, Ranks.SEVEN),
    ];

    var result = ranking.compareRankings(ranking.rankHand(cards01), ranking.rankHand(cards02));
    var passed = true;
    if (result <= 0) {
        passed = false;
    }

    return new TestResult(passed, "compareRankingsTest02. result = " + result);
}

function compareRankingsTest03() {
    var cards01 = [
        new Card(Suites.HEARTS, Ranks.TWO),
        new Card(Suites.HEARTS, Ranks.THREE),
        new Card(Suites.HEARTS, Ranks.FOUR),
        new Card(Suites.HEARTS, Ranks.FIVE),
        new Card(Suites.HEARTS, Ranks.SIX),
        new Card(Suites.CLUBS, Ranks.SEVEN),
        new Card(Suites.DIAMONDS, Ranks.SEVEN),
    ];

    var cards02 = [
        new Card(Suites.SPADES, Ranks.TWO),
        new Card(Suites.SPADES, Ranks.THREE),
        new Card(Suites.SPADES, Ranks.FOUR),
        new Card(Suites.SPADES, Ranks.FIVE),
        new Card(Suites.SPADES, Ranks.SIX),
        new Card(Suites.HEARTS, Ranks.JACK),
        new Card(Suites.DIAMONDS, Ranks.SEVEN),
    ];

    var result = ranking.compareRankings(ranking.rankHand(cards01), ranking.rankHand(cards02));
    var passed = true;
    if (result <= 0) {
        passed = false;
    }

    return new TestResult(passed, "compareRankingsTest03. result = " + result);
}


function runAllTests() {
    var testResults = [];
    testResults.push(sortCardsByRankTest01());
    testResults.push(sortCardsByRankTest02());
    testResults.push(countCardsByRankTest01());
    testResults.push(countCardsBySuiteTest01());
    testResults.push(rankHandTest01());
    testResults.push(rankHandTest02());
    testResults.push(rankHandTest03());
    testResults.push(rankHandTest04());
    testResults.push(rankHandTest05());
    testResults.push(rankHandTest06());
    testResults.push(rankHandTest07());
    testResults.push(rankHandTest08());
    testResults.push(rankHandTest09());
    testResults.push(rankHandTest10());
    testResults.push(compareIndividualRankingTest01());
    testResults.push(compareIndividualRankingTest02());
    testResults.push(compareIndividualRankingTest03());
    testResults.push(compareIndividualRankingTest04());
    testResults.push(compareIndividualRankingTest05());
    testResults.push(compareIndividualRankingTest06());
    testResults.push(compareRankingsTest01());
    testResults.push(compareRankingsTest02());
    testResults.push(compareRankingsTest03());


    return testResults;
}

module.exports = {
    runAllTests : runAllTests
};
