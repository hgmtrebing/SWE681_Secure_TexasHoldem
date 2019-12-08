$(document).ready(function() {

    socketConnection.connect("https://localhost:8081");
    socketConnection.on('game-status-message', function(msg){
        processMessage(msg);
    });

    socketConnection.on('get-user-action-message', function (msg) {
        processMessage(msg);
    });

    socketConnection.on("get-user-info", function (msg) {
        socketConnection.emit("user-info", {username: sessionStorage.user, token: sessionStorage.token});
    });

    $("#raise-range").on("input change", function() {
        $("#raise-amount").html("$" + $("#raise-range").val());
    });

    $("#ok-button").on("click", function () {
        var msg = {_id: 4, username: "", jwt: "", action: "", betAmount: 0};
        msg.username = sessionStorage.getItem("user");
        msg.jwt = sessionStorage.getItem("token");
        if ($("#list-call-list").hasClass('active')) {
            msg.action = 'CALL';
            msg.betAmount = callAmount;
        } else if ($("#list-allin-list").hasClass('active')) {
            msg.action = 'ALLIN';
            msg.betAmount = balance - bets;
        } else if ($("#list-check-list").hasClass('active')) {
            msg.action = 'CHECK';
        } else if ($("#list-raise-list").hasClass('active')) {
            msg.action = 'RAISE';
            msg.betAmount = $("#raise-range").val();
        }

        socketConnection.emit("user-action-message", msg);
        $("#user-action-modal").modal('hide');
        console.log("User action message sent: " + JSON.stringify(msg));
    });

    $("#fold-button").on("click", function () {
        var msg = {_id: 4, username: "", jwt: "", action: "FOLD", betAmount: 0};
        msg.username = sessionStorage.getItem("user");
        msg.jwt = sessionStorage.getItem("token");
        socketConnection.emit("user-action-message", msg);
        $("#user-action-modal").modal('hide');
        console.log("User action message sent: " + JSON.stringify(msg));
    });

    $("#leave-button").on("click", function () {
        var msg = {_id: 4, username: "", jwt: "", action: "LEAVE", betAmount: 0};
        msg.username = sessionStorage.getItem("user");
        msg.jwt = sessionStorage.getItem("token");
        socketConnection.emit("user-action-message", msg);
        $("#user-action-modal").modal('hide');
        console.log("User action message sent: " + JSON.stringify(msg));
    });


    function processMessage(message) {

        // alert ("Message Received " + JSON.stringify(message));
        // Game Status Message
        if (message._id === 5) {
            // Table Status
            var tableStatus = message.tableStatus;
            if (tableStatus._id === 3) {
                $("#pot-display").html("Pot: $" + tableStatus.pot);
                $("#game-display").html("Game: " + tableStatus.gameNumber);
                $("#round-display").html("Round: " + tableStatus.round);

                if (tableStatus.flop1 !== null && tableStatus.flop1._id === 7) {
                    $("#flop-1 .card-img").html(translateSuite(tableStatus.flop1.suiteName));
                    $("#flop-1 .card-text").html(translateRank(tableStatus.flop1.rankName));
                    $("#flop-1 .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop1.suiteName));
                    $("#flop-1 .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop1.suiteName));
                }

                if (tableStatus.flop2 !== null && tableStatus.flop2._id === 7) {
                    $("#flop-2 .card-img").html(translateSuite(tableStatus.flop2.suiteName));
                    $("#flop-2 .card-text").html(translateRank(tableStatus.flop2.rankName));
                    $("#flop-2 .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop2.suiteName));
                    $("#flop-2 .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop2.suiteName));

                }

                if (tableStatus.flop3 !== null && tableStatus.flop3._id === 7) {
                    $("#flop-3 .card-img").html(translateSuite(tableStatus.flop3.suiteName));
                    $("#flop-3 .card-text").html(translateRank(tableStatus.flop3.rankName));
                    $("#flop-3 .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop3.suiteName));
                    $("#flop-3 .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.flop3.suiteName));

                }

                if (tableStatus.turn !== null && tableStatus.turn._id === 7) {
                    $("#turn .card-img").html(translateSuite(tableStatus.turn.suiteName));
                    $("#turn .card-text").html(translateRank(tableStatus.turn.rankName));
                    $("#turn .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.turn.suiteName));
                    $("#turn .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.turn.suiteName));

                }

                if (tableStatus.river !== null && tableStatus.river._id === 7) {
                    $("#river .card-img").html(translateSuite(tableStatus.river.suiteName));
                    $("#river .card-text").html(translateRank(tableStatus.river.rankName));
                    $("#river .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.river.suiteName));
                    $("#river .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(tableStatus.river.suiteName));

                }

            }

            processCurrentPlayerStatus(message.currentPlayer);
            processOtherPlayer(message.otherPlayers);

            // Get User Action Message
        } else if (message._id === 6) {
            processGetUserActionMessage(message);
        }
    }

    function processGetUserActionMessage(message) {
        if (!processingGetUserActionMessage && $("#user-action-modal").hasClass("show")) {
            return;
        }

        validActions = message.validActions;
        callAmount = parseInt(message.callAmount);
        balance = parseInt(message.balance);
        bets = parseInt(message.bets);
        timerStart = parseInt(message.timerStart);

        $("#list-allin-list").addClass('disabled');
        $("#list-call-list").addClass('disabled');
        $("#list-check-list").addClass('disabled');
        $("#list-raise-list").addClass('disabled');

        for (var i = 0; i < validActions.length; i++) {
            if (validActions[i] === "RAISE") {
                $("#list-raise-list").removeClass('disabled');
            } else if (validActions[i] === "CALL") {
                $("#list-call-list").removeClass('disabled');
            } else if (validActions[i] === "CHECK") {
                $("#list-check-list").removeClass('disabled');
            } else if (validActions[i] === "ALLIN") {
                $("#list-allin-list").removeClass('disabled');
            }
        }

        $("#modal-balance").html("Your balance: $" + balance);
        $("#modal-bets").html("Your bets, so far: $" + bets);
        $("#modal-call-amount").html("Call Amount: $" + callAmount);
        $("#modal-timer").html("Time Remaining: " + timerStart);
        $("#list-all-in").html("Go all in for $" + (balance-bets) + "?");
        $("#list-call").html("Call for $" + callAmount);

        $("#raise-range").attr("min", callAmount);
        $("#raise-range").attr("max", balance);
        $("#raise-range").attr("step", 10);
        $("#raise-amount").html("$" + callAmount);

        var countdown = setInterval(function() {
            if (timerStart >= 0) {
                $("#modal-timer").html("Time Remaining: " + timerStart);
                timerStart--;
            } else if (timerStart >= -3) {
                timerStart--;
            } else if (timerStart >= -8) {
                timerStart--;
                $("#user-action-modal").modal('hide');
            } else {
                processingGetUserActionMessage = true;
                $("#user-action-modal").modal('hide');
                clearTimeout(countdown);
            }
        }, 1000);

        $("#user-action-modal").modal({});
        processingGetUserActionMessage = false;
    }

    function processOtherPlayer(otherPlayers) {
        for (var i = 0; i < otherPlayers.length; i++) {
            var player = otherPlayers[i];
            var name = player.name;
            var balance = player.balance;
            var bet = player.bet;
            var status = player.status;
            var action = player.action.action;
            var cardASuite;
            var cardARank;
            if (player.cardA !== null) {
                cardASuite = player.cardA.suiteName;
                cardARank = player.cardA.rankName;
            }

            var cardBSuite = null;
            var cardBRank = null;
            if (player.cardB !== null) {
                cardBSuite = player.cardB.suiteName;
                cardBRank = player.cardB.rankName;
            }
            var isBigBlind = player.isBigBlind;
            var isSmallBlind = player.isSmallBlind;

            var playerHtml;
            if (i === 0) {
                playerHtml = player0;
            } else if (i === 1) {
                playerHtml = player1;
            } else if (i === 2) {
                playerHtml = player2;
            } else if (i === 3) {
                playerHtml = player3;
            } else if (i === 4) {
                playerHtml = player4;
            } else if (i === 5) {
                playerHtml = player5;
            } else {
                // TODO
            }

            $(playerHtml + " .player-name").html(name);
            $(playerHtml + " .player-balance").html("$" + balance);
            $(playerHtml + " .player-current-bets").html("$" + bet);
            $(playerHtml + " .player-status").html(status);
            $(playerHtml + " .player-most-recent-action").html(action);

            $(playerHtml + " .cardA .card-text").html(translateRank(cardARank));
            $(playerHtml + " .cardA .card-img").html(translateSuite(cardASuite));
            $(playerHtml + " .cardA .card-img").removeClass(blackClass);
            $(playerHtml + " .cardA .card-img").removeClass(redClass);
            $(playerHtml + " .cardA .card-img").addClass(translateColor(cardASuite));
            $(playerHtml + " .cardA .card-text").removeClass(blackClass);
            $(playerHtml + " .cardA .card-text").removeClass(redClass);
            $(playerHtml + " .cardA .card-text").addClass(translateColor(cardASuite));

            $(playerHtml + " .cardb .card-text").html(translateRank(cardBRank));
            $(playerHtml + " .cardb .card-img").html(translateSuite(cardBSuite));
            $(playerHtml + " .cardb .card-img").removeClass(blackClass);
            $(playerHtml + " .cardb .card-img").removeClass(redClass);
            $(playerHtml + " .cardb .card-img").addClass(translateColor(cardBSuite));
            $(playerHtml + " .cardb .card-text").removeClass(blackClass);
            $(playerHtml + " .cardb .card-text").removeClass(redClass);
            $(playerHtml + " .cardb .card-text").addClass(translateColor(cardBSuite));
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

            /*
            $(seat + " .player-name").html(currentPlayer.name);
            $(seat + " .player-balance").html("| Balance: $" + currentPlayer.balance);
            $(seat + " .player-status").html(currentPlayer.status);
            $(seat + " .player-most-recent-action").html("| " + currentPlayer.mostRecentAction);
            $(seat + " .player-current-bets").html("| $" + currentPlayer.bets);
             */

            if (currentPlayer.cardA !== undefined && currentPlayer.cardA._id === 7) {
                $(seat + " .cardA .card-img").html(translateSuite(currentPlayer.cardA.suiteName));
                $(seat + " .cardA .card-text").html(translateRank(currentPlayer.cardA.rankName));
                $(seat + " .cardA .card-img").removeClass(redClass).removeClass(blackClass).addClass(translateColor(currentPlayer.cardA.suiteName));
                $(seat + " .cardA .card-text").removeClass(redClass).removeClass(blackClass).addClass(translateColor(currentPlayer.cardA.suiteName));
            }

            if (currentPlayer.cardB !== undefined && currentPlayer.cardB._id === 7) {
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

var processingGetUserActionMessage = true;
var validActions = null;
var callAmount = null;
var balance = null;
var bets = null;
var timerStart = null;

