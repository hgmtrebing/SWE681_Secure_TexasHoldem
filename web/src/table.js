$(document).ready(function() {
    const spadeIcon = "&spades;";
    const diamondIcon = "&diams;";
    const heartIcon = "&hearts;";
    const clubIcon = "&clubs;";
    const redClass = "red";
    const blackClass = "black";
    const player0 = "#player-0";
    const player1 = "#player-1";
    const player2 = "#player-2";
    const player3 = "#player-3";
    const player4 = "#player-4";
    const player5 = "#player-5";

    var socket = io();
    socket.on('game-status-message', function(msg){
        processMessage(msg);
    });

    function processMessage(message) {

        alert ("Message Received " + JSON.stringify(message));
        // Game Status Message
        if (message._id === 5) {
            // Table Status
            var tableStatus = message.tableStatus;
            if (tableStatus._id === 3) {
                $("#pot-display").html("Pot: $" + tableStatus.pot);
                $("#game-display").html("Game: " + tableStatus.gameNumber);
                $("#round-display").html("Round: " + tableStatus.round);

                if (tableStatus.flop1._id === 7) {
                    $("#flop-1 .card-img").html(translateSuite(tableStatus.flop1.suiteName));
                    $("#flop-1 .card-text").html(translateRank(tableStatus.flop1.rankName));
                    $("#flop-1 .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop1.suiteName));
                    $("#flop-1 .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop1.suiteName));
                }

                if (tableStatus.flop2._id === 7) {
                    $("#flop-2 .card-img").html(translateSuite(tableStatus.flop2.suiteName));
                    $("#flop-2 .card-text").html(translateRank(tableStatus.flop2.rankName));
                    $("#flop-2 .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop2.suiteName));
                    $("#flop-2 .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop2.suiteName));

                }

                if (tableStatus.flop3._id === 7) {
                    $("#flop-3 .card-img").html(translateSuite(tableStatus.flop3.suiteName));
                    $("#flop-3 .card-text").html(translateRank(tableStatus.flop3.rankName));
                    $("#flop-3 .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop3.suiteName));
                    $("#flop-3 .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop3.suiteName));

                }

                if (tableStatus.turn._id === 7) {
                    $("#turn .card-img").html(translateSuite(tableStatus.turn.suiteName));
                    $("#turn .card-text").html(translateRank(tableStatus.turn.rankName));
                    $("#turn .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.turn.suiteName));
                    $("#turn .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.turn.suiteName));

                }

                if (tableStatus.river._id === 7) {
                    $("#river .card-img").html(translateSuite(tableStatus.river.suiteName));
                    $("#river .card-text").html(translateRank(tableStatus.river.rankName));
                    $("#river .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.river.suiteName));
                    $("#river .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.river.suiteName));

                }

            }

            processCurrentPlayerStatus(message.currentPlayer);

            // Other Players
            for (var i = 0; i < message.otherPlayers.length; i++) {

            }
        }
    }

    function processCurrentPlayerStatus(currentPlayer) {
        if (currentPlayer._id === 1) {
            var seat = "";

            if (currentPlayer.seat === 0) {
                seat = player0;
            } else if (currentPlayer.seat === 1) {
                seat = player1;
            } else if (currentPlayer.seat === 2) {
                seat = player2;
            } else if (currentPlayer.seat === 3) {
                seat = player3;
            } else if (currentPlayer.seat === 4) {
                seat = player4;
            } else if (currentPlayer.seat === 5) {
                seat = player5;
            }

            $(seat + " .player-name").html(currentPlayer.name);
            $(seat + " .player-balance").html("| Balance: $" + currentPlayer.balance);
            $(seat + " .player-status").html(currentPlayer.status);
            $(seat + " .player-most-recent-action").html("| " + currentPlayer.mostRecentAction);
            $(seat + " .player-current-bets").html("| $" + currentPlayer.bets);

            if (currentPlayer.cardA._id === 7) {
                $(seat + " .cardA .card-img").html(translateSuite(currentPlayer.cardA.suiteName));
                $(seat + " .cardA .card-text").html(translateRank(currentPlayer.cardA.rankName));
                $(seat + " .cardA .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(currentPlayer.cardA.suiteName));
                $(seat + " .cardA .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(currentPlayer.cardA.suiteName));
            }

            if (currentPlayer.cardB._id === 7) {
                $(seat + " .cardb .card-img").html(translateSuite(currentPlayer.cardB.suiteName));
                $(seat + " .cardb .card-text").html(translateRank(currentPlayer.cardB.rankName));
                $(seat + " .cardb .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(currentPlayer.cardB.suiteName));
                $(seat + " .cardb .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(currentPlayer.cardB.suiteName));

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
            return "";
        }
    }

    function translateColor(suiteName) {
        if (suiteName === "clubs") {
            return blackClass;
        } else if (suiteName === "diamonds") {
            return redClass;
        } else if (suiteName === "hearts") {
            return redClass;
        } else if (suiteName === "spades") {
            return blackClass;
        } else {
            return "";
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
            return "";
        }
    }

});


