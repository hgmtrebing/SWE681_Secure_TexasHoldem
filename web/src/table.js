$(document).ready(function() {
    const spadeIcon = "&spades;";
    const diamondIcon = "&diams;";
    const heartIcon = "&hearts;";
    const clubIcon = "&clubs;";
    const redClass = "red";
    const blackClass = "black";

    var p = $("#player-0 .card-img");
    p.removeClass(blackClass);
    p.addClass(redClass);

    function updateCard (card, suite, rank) {
        if (suite === null && rank === null) {
        }
    }

    function processMessage(message) {

        // Game Status Message
        if (message._id === 5) {
            var tableStatus = message.tableStatus;
            if (tableStatus._id === 3) {
                $("#pot-display").html("Pot: $" + tableStatus.pot);
                $("#game-display").html("Game: " + tableStatus.gameNumber);
                $("#round-display").html("Round: " + tableStatus.round);

                if (tableStatus.flop1._id === 7) {

                }

                if (tableStatus.flop2._id === 7) {

                }

                if (tableStatus.flop3._id === 7) {

                }

                if (tableStatus.turn._id === 7) {

                }

                if (tableStatus.river._id === 7) {

                }

            }
        }
    }

    function translateSuite(suiteName) {
        if (suiteName === "clubs") {
            return clubIcon;
        } else if (suiteName === "diamonds") {
            return diamondIcon;
        } else if (suiteName === "hearts") {
            return heartIcon;
        } else if (suiteName === "spades") {
            return spadeIcon;
        } else {
            return null;
        }
    }

    function translateRank(rankName) {
        if (rankName === "two") {
            return "2";
        } else if (rankName === "three") {
            return "3";
        } else if (rankName === "four") {
            return "4";
        } else if (rankName === "five") {
            return "5";
        } else if (rankName === "six") {
            return "6";
        } else if (rankName === "seven") {
            return "7";
        } else if (rankName === "eight") {
            return "8";
        } else if (rankName === "nine") {
            return "9";
        } else if (rankName === "ten") {
            return "10";
        } else if (rankName === "jack") {
            return "J";
        } else if (rankName === "queen") {
            return "Q";
        } else if (rankName === "king") {
            return "K";
        } else if (rankName === "ace") {
            return "A";
        } else {
            return null;
        }
    }

    processMessage({
        _id: 5,
        tableStatus: {
            _id: 3,
            pot: 4500,
            gameNumber: 15,
            round: "River"
        }
    });
});


