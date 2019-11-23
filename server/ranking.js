var Rank = require('./carddeck').Rank;
var Suite = require('./carddeck').Suite;
var Card = require('./carddeck').Card;

function Ranking (name, rankBaseValue) {
    this.name = name;
    this.rankBaseValue = rankBaseValue;
}

var Rankings = {
    TWO_HIGH : new Ranking("two high", 2),
    THREE_HIGH : new Ranking("three high", 3),
    FOUR_HIGH : new Ranking("four high", 4),
    FIVE_HIGH : new Ranking("five high", 5),
    SIX_HIGH : new Ranking("six high", 6),
    SEVEN_HIGH : new Ranking("seven high", 7),
    EIGHT_HIGH : new Ranking("eight high", 8),
    NINE_HIGH : new Ranking("nine high", 9),
    TEN_HIGH : new Ranking("ten high", 10),
    JACK_HIGH : new Ranking("jack high", 11),
    QUEEN_HIGH : new Ranking("queen high", 12),
    KING_HIGH : new Ranking("king high", 13),
    ACE_HIGH : new Ranking("ace high", 14),
    PAIR : new Ranking("pair", 15),
    TWO_PAIR : new Ranking("two pair", 16),
    THREE_OF_A_KIND : new Ranking("three of a kind", 17),
    STRAIGHT : new Ranking("straight", 18),
    FLUSH : new Ranking("flush", 19),
    FULL_HOUSE : new Ranking("full house", 20),
    FOUR_OF_A_KIND : new Ranking("four of a kind", 21),
    STRAIGHT_FLUSH : new Ranking("straight flush", 22),
    ROYAL_FLUSH : new Ranking("royal flush", 23)
};

function sortCards (cards) {
    cards.sort(function(a, b) {
        var rank1 = a.rank.value - b.rank.value;
        if (rank1 === 0) {
            return a.suite.value - b.suite.value;
        } else {
            return rank1;
        }
    });
}

function rankHand(cards) {
    sortCards(cards);
    var score = 0;

    for (var i = cards.length-1; i > 0; i--) {

        var pairEligible = true;
        var threeOfAKindEligible = true;
        var risingStraightEligible = true;
        var fallingStraightEligible = true;
        var fullHouseEligible = true;
        var fourOfAKindEligible = true;
        var straightFlushEligible = true;
        var royalFlushEligible = true;

        var flushCounter = 0;

        for (var j = i-1; j >= 0; j--) {

            if (cards[i].rank !== 14) {
                royalFlushEligible = false;
            }

            if (cards[i].rank.value !== cards[j].rank.value) {
                if (i-j === 1) {
                    pairEligible = false;
                    threeOfAKindEligible = false;
                    fourOfAKindEligible = false;
                } else if (i-j === 2) {
                    threeOfAKindEligible = false;
                    fourOfAKindEligible = false;
                } else if (i-j === 3) {
                    fourOfAKindEligible = false;
                }
            }

            if (cards[i].suite.value === cards[j].suite.value) {
                flushCounter++;
            }
        }
    }
}

module.exports = {
    sortCards: sortCards
};
