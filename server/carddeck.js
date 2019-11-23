var random = require("secure-random");

function Suite (name, value) {
    this.name = name;
    this.value = value;
    this.equals = function(other) {
        if (other instanceof Suite) {
            return this.name === other.name && this.value === other.value;
        } else {
            return false;
        }
    };

    this.toString = function() {
        return this.name;
    }
}

var Suites = {
    HEARTS: new Suite("hearts", 0),
    SPADES: new Suite("spades", 1),
    DIAMONDS: new Suite("diamonds", 2),
    CLUBS: new Suite("clubs")
};

function Rank (name, value) {
    this.name = name;
    this.value = value;
    this.equals = function(other) {
        if (other instanceof Rank) {
            return this.name === other.name && this.value === other.value;
        } else {
            return false;
        }
    };

    this.compareTo = function(other) {
        if (other instanceof Rank) {
            return this.value - other.value;
        } else {
            return undefined;
        }
    };

    this.toString = function() {
        return this.name;
    }
}

var Ranks = {
        TWO: new Rank("two", 2),
        THREE: new Rank("three", 3),
        FOUR: new Rank("four", 4),
        FIVE: new Rank("five", 5),
        SIX: new Rank("six", 6),
        SEVEN: new Rank("seven", 7),
        EIGHT: new Rank("eight", 8),
        NINE: new Rank("nine", 9),
        TEN: new Rank("ten", 10),
        JACK: new Rank("jack", 11),
        QUEEN: new Rank("queen", 12),
        KING: new Rank("king", 13),
        ACE: new Rank("ace", 14),
};

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
    this.deck = [];
    for (var suite in Suites ) {
        for (var rank in Ranks ) {
            this.deck.push(new Card(Suites[suite], Ranks[rank]));
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

    this.toString = function() {
        var str = "";
        for (var i = 0; i < this.deck.length; i++) {
            str += this.deck[i].toString() + "\n";
        }
        return str;
    }
}

module.exports = {
    Rank : Rank,
    Suite : Suite,
    Ranks: Ranks,
    Suites: Suites,
    Card : Card,
    CardDeck : CardDeck
};


