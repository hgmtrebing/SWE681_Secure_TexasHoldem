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

function HandRanking (ranking, highCardRank, minorHighCardRank, minorHighCardRank2, minorHighCardRank3, minorHighCardRank4) {
    this.ranking = ranking;
    this.highCardRank = highCardRank;
    this.minorHighCardRank = minorHighCardRank; // used for flushes, two pair, full house
    this.minorHighCardRank2 = minorHighCardRank2; // used for flushes
    this.minorHighCardRank3 = minorHighCardRank3; // used for flushes
    this.minorHighCardRank4 = minorHighCardRank4; // used for flushes
}

function sortCardsByRank (cards) {
    cards.sort(function(a, b) {
        var rank1 = a.rank.value - b.rank.value;
        if (rank1 === 0) {
            return a.suite.value - b.suite.value;
        } else {
            return rank1;
        }
    });
}

function sortCardsBySuite (cards) {
    cards.sort(function(a, b) {
        var suiteRank = a.suite.value - b.suite.value;
        if (suiteRank === 0) {
            return a.rank.value - b.rank.value;
        } else {
            return suiteRank;
        }
    });
}

function countCardsByRank (cards) {
    var rankCount = {};
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].rank in rankCount) {
            rankCount[cards[i].rank]++;
        } else {
            rankCount[cards[i].rank]=1;
        }
    }
    return rankCount;
}

function countCardsBySuite(cards) {
    var suiteCount = {};
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suite in suiteCount) {
            suiteCount[cards[i].suite]++;
        } else {
            suiteCount[cards[i].suite] = 1;
        }
    }
    return suiteCount;
}

function getSubarrayBySuite(cards, suite) {
    var newCards = [];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suite === suite) {
            newCards.push(cards[i]);
        }
    }
    return newCards;
}

function rankHand(cards) {
    var rankings = [];

    // Determine Pairs, Three of a Kinds, and Four of A Kind
    var rankCount = countCardsByRank(cards);
    for (var key in rankCount) {
        if (rankCount[key] === 2) {
           rankings.push(new HandRanking(Rankings.PAIR, key, null));
        } else if (rankCount[key] === 3) {
            rankings.push(new HandRanking(Rankings.THREE_OF_A_KIND, key, null));
        } else if (rankCount[key] === 4) {
            rankings.push(new HandRanking(Rankings.FOUR_OF_A_KIND, key, null));
        }
    }

    // Determine Full Houses and Two Pairs
    for (var i = 0; i < rankings.length; i++) {
        var rank1 = rankings[i].ranking;
        if (rank1 === Rankings.THREE_OF_A_KIND || Rankings.PAIR) {
            for (var j = i+i; i< rankings.length; i++) {
                var rank2 = rankings[j].ranking;
                if (rank1 === Rankings.THREE_OF_A_KIND && rank2 === Rankings.PAIR) {
                    rankings.push(new HandRanking(Rankings.FULL_HOUSE, rank1, rank2));
                } else if (rank1 === Rankings.PAIR && rank2 === Rankings.THREE_OF_A_KIND) {
                    rankings.push(new HandRanking(Rankings.FULL_HOUSE, rank2, rank1));
                } else if (rank1 === Rankings.PAIR && rank2 === Rankings.PAIR) {
                    var tempRank = null;

                    // If the high card of the first pair is less than the second pair, switch them
                    // This way, the major high card field reflects the highest value two pairs
                    if (rank1.value < rank2.value) {
                        tempRank = rank1;
                        rank1 = rank2;
                        rank2 = tempRank;
                    }
                    rankings.push(new HandRanking(Rankings.TWO_PAIR), rank1, rank2);
                }
            }
        }
    }

    // Determine Flushes
    var suiteCount = countCardsBySuite(cards);
    for (var key in suiteCount) {
        if (suiteCount[key] >= 5) {
            newCards = getSubarrayBySuite(cards, key);
            sortCardsByRank(newCards);
            var length = newCards.length;
            rankings.push(new HandRanking(Rankings.FLUSH, newCards[length-1].rank, newCards[length-2].rank,
                newCards[length-3].rank, newCards[length-4].rank, newCards[length-5].rank))

            // Checks the flush for straights
            var counter = length-1;
            while (counter-4 >= 0) {
                if (newCards[counter].rank.value === newCards[counter-1].rank.value-1 &&
                    newCards[counter].rank.value === newCards[counter-2].rank.value-2 &&
                    newCards[counter].rank.value === newCards[counter-3].rank.value-3 &&
                    newCards[counter].rank.value === newCards[counter-4].rank.value-4 ) {

                    // If the highest card is an ace, this is a royal flush
                    // If not, it is a straight flush
                    if (newCards[counter].rank.value === 14) {
                        rankings.push (new HandRanking(Rankings.ROYAL_FLUSH, newCards[counter].rank.value));
                    } else {
                        rankings.push(new HandRanking(Rankings.STRAIGHT_FLUSH, newCards[counter].rank.value));
                    }
                }
                counter--;
            }
        }
    }

    // Determine Non-Flush Straights
    // this hack basically eliminates duplicates - aka, if an Eight of Diamonds and an Eight of Hearts are both in cards
    // The presence of duplicates fucks up naive methods of counting straights
    rankCount = countCardsByRank(cards);
    var ranks = rankCount.keys();
    ranks.sort(function (a, b) {
        return a.value - b.value;
    });
    for (var i = 0; i+4 < ranks.length; i++) {
        if (ranks[i].value === ranks[i+1].value+1 &&
            ranks[i].value === ranks[i+2].value+2 &&
            ranks[i].value === ranks[i+3].value+3 &&
            ranks[i].value === ranks[i+4].value+4) {

            rankings.push(new HandRanking(Rankings.STRAIGHT, rankings[i+4]));
        }
    }

    return rankings;
}

module.exports = {
    sortCardsByRank: sortCardsByRank,
    sortCardsBySuite: sortCardsBySuite,
    countCardsByRank: countCardsByRank,
    countCardsBySuite: countCardsBySuite,
    rankHand : rankHand
};
