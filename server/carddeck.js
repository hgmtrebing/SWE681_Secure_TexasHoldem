var random = require("secure-random");

function Suite (name) {
    this.name = name;
    this.equals = function(other) {
        if (other instanceof Suite) {
            return this.name === other.name;
        } else {
            return false;
        }
    };

    this.toString = function() {
        return this.name;
    }
}

function Rank (name, value) {
    this.name = name;
    this.value = value;
    this.equals = function(other) {
        if (other instanceof Rank) {
            return this.name === other.name && this.value === other.value;
        } else {
            return false;
        }
    }

    this.toString = function() {
        return this.name;
    }
}

function Card(suite, rank) {
    this.suite = suite;
    this.rank = rank;
    this.equals = function (other) {
        if (other instanceof Card) {
            return this.suite.equals(other.suite) && this.rank.equals(other.rank);
        } else {
            return false;
        }
    };

    this.toString = function() {
        return this.rank.toString() + " of " + this.suite.toString();
    };
}

function CardDeck() {
    this.suites = [new Suite("hearts"), new Suite("spades"), new Suite("diamonds"), new Suite("clubs")];
    this.ranks = [
        new Rank("two", 2),
        new Rank("three", 3),
        new Rank("four", 4),
        new Rank("five", 5),
        new Rank("six", 6),
        new Rank("seven", 7),
        new Rank("eight", 8),
        new Rank("nine", 9),
        new Rank("ten", 10),
        new Rank("jack", 11),
        new Rank("queen", 12),
        new Rank("king", 13),
        new Rank("ace", 14),
    ];

    this.deck = [];
    for (var suite = 0; suite < this.suites.length; suite++ ) {
        for (var rank = 0; rank < this.ranks.length; rank++) {
            this.deck.push(new Card(this.suites[suite], this.ranks[rank]));
        }
    }

    /**
     * This method shuffles the deck, using a secure random function.
     */
    this.shuffle = function() {
        var newDeck = [];
        while (this.deck.length > 0) {
            var index = random(1)[0] % this.deck.length;
            newDeck.push(this.deck.splice(index, 1)[0]);
        }
        this.deck = newDeck;
    };
}

module.exports = {
    Rank : Rank,
    Suite : Suite,
    Card : Card,
    CardDeck : CardDeck
};


