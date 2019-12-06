const Status = require("./definition").Status;
const Actions = require("./definition").Actions;

function Player (seat, status, receiveFunction) {
    this.user = {username: "EMPTY SEAT", balance: 0};
    this.seat = seat;
    this.status = status;
    this.lastAction = Actions.UNDEFINED;
    this.currentRoundBet = 0;
    this.bets = 0;
    this.cardA = null;
    this.cardB = null;
    this.rank = null;

    this.addUser = function(user) {
        this.user = user;
        this.status = Status.ACTIVE;
    };

    this.removeUser = function() {
        this.user = null;
        this.bets = 0;
        this.status = Status.EMPTY;
    };

    this.send = function(message) {
            console.log("GAME STATUS SENT TO PLAYER " + this.seat + ": Round-" + message.tableStatus.round);
    };

    this.receive = receiveFunction;

    this.toString = function() {
        return "Username: " + this.user.name + "\n" +
               "Balance: " + this.user.balance + "\n" +
               "Seat: " + this.seat + "\n" +
               "Status: " + this.status + "\n" +
               "Bets: " + this.bets + "\n" +
               "Card A: " + this.cardA.toString() + "\n" +
               "Card B: " + this.cardB.toString() + "\n";
    }
}


function PlayerCollection () {

    this.waitingUsers = [];
    this.players = [
        new Player(0, Status.EMPTY),
        new Player(1, Status.EMPTY),
        new Player(2, Status.EMPTY),
        new Player(3, Status.EMPTY),
        new Player(4, Status.EMPTY),
        new Player(5, Status.EMPTY)
    ];

    /**
     * Resets all non-empty players back to active, in anticipation of a new game.
     */
    this.setActive = function () {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.status !== Status.EMPTY) {
                player.status = Status.ACTIVE;
                this.log.logSystem("Player #" + i + "( " + player.user.username + " ) was set to ACTIVE");
            }
        }
    };

    /**
     * Removes a user with a given username from both the "Waiting Players" list and the
     * @param username
     */
    this.removeUser = function(username) {

        // check waiting users first
        for (var i = 0; i < this.waitingUsers.length; i++) {
            if (this.waitingUsers[i].username === username) {
                this.waitingUsers.splice(i, 1);
                this.log.logSystem("Waiting User removed from index " + i);
            }
        }

        // Now check players
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].user.username === username) {
                this.players[i].removeUser();
                this.log.logSystem("Player removed from seat #" + i);
            }
        }
    };

    /**
     * Adds waiting users to empty players. If there are no waiting users, or no empty players, this method will return.
     */
    this.addWaitingPlayers = function() {
        while ( this.waitingUsers.length > 0) {
            if (this.getNumberOfPlayers(Status.EMPTY, true) <= 0) {
                this.log.logSystem("Attempting to add waiting players, but there are no remaining seats");
                return;
            }
            var user = this.waitingUsers.pop();
            var index = this.getNextPlayerIndex(0, Status.EMPTY, true, true, true);
            this.players[index].addUser(user);
            this.log.logSystem("User " + user.username + " added as Player #" + index);
        }
    };

    // Use ALL to get total number of players
    this.getNumberOfPlayers = function(status, matchesStatus) {
        var playerNum = 0;
        for (var i = 0; i < this.players.length; i++) {
            if (matchesStatus && this.players[i].status === status){
                playerNum++;
            } else if (!matchesStatus && this.players[i].status !== status) {
                playerNum++;
            } else if (status === Status.ALL) {
                playerNum++;
            }
        }
        return playerNum;
    };

    // Use -1 as starting index if starting from the beginning of the array
    this.getNextPlayerIndex = function(startingIndex, status, matchesStatus, inclusive, forwards) {

        // Sanitize startingIndexes that are outside of the range of players
        if (startingIndex < 0) {
            startingIndex = 0;
        } else if (startingIndex >= this.players.length) {
            startingIndex = this.players.length-1;
        }

        var currentIndex;
        var endingIndex;

        // Logic to determine the initial value currentIndex - the counter variable
        if (inclusive) {
            currentIndex = startingIndex;
        } else if (forwards && startingIndex >= this.players.length-1) {
            currentIndex = 0;
        } else if (forwards) {
            currentIndex = startingIndex+1;
        } else if (!forwards && startingIndex <= 0) {
            currentIndex = this.players.length-1;
        } else if (!forwards) {
            currentIndex = startingIndex-1;
        }

        // Logic to determine the value of endingIndex - the index at which searching will stop
        if (forwards && currentIndex === 0) {
            endingIndex = this.players.length-1;
        } else if (!forwards && currentIndex === this.players.length-1){
            endingIndex = 0;
        } else if (forwards) {
            endingIndex = currentIndex - 1;
        } else if (!forwards) {
            endingIndex = currentIndex + 1;
        }

        // Keep iterating until current index reaches ending index
        while (currentIndex !== endingIndex) {

            if (matchesStatus && this.players[currentIndex].status === status) {
                return currentIndex;
            } else if (!matchesStatus && this.players[currentIndex].status !== status) {
                return currentIndex;
            } else if (status === Status.ALL) {
                return currentIndex;
            }

            if (forwards && currentIndex >= this.players.length-1) {
                currentIndex = 0;
            } else if (forwards){
                currentIndex++;
            } else if (!forwards && currentIndex <= 0) {
                currentIndex = this.players.length-1;
            } else if (!forwards) {
                currentIndex--;
            }
        }
        return null;
    };

    this.getPlayerAt = function(index) {
        if (index >= this.players.length || index < 0) {
            return null;
        } else {
            return this.players[index];
        }
    };

    this.sendToAll = function() {

    };

    this.toString = function () {
        var str = "";
        for (let i = 0; i < this.players.length; i++) {
            str += this.players[i] + "\n";
        }
        return str;
    };
}

module.exports = {
    Player: Player,
    PlayerCollection : PlayerCollection
};
