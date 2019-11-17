
function Player (seat, status) {
    this.user = null;
    this.seat = seat;
    this.status = "";
    this.bets = 0;
    this.cardA = null;
    this.cardB = null;
}

function Status () {
    this.EMPTY = "EMPTY";
    this.ACTIVE = "ACTIVE";
    this.FOLDED = "FOLDED";
}

function PlayerCollection () {
    // EMPTY
    // FOLDED
    // ACTIVE

    this.waitingUsers = [];
    this.players = [
        new Player(0, Status.EMPTY),
        new Player(1, Status.EMPTY),
        new Player(2, Status.EMPTY),
        new Player(3, Status.EMPTY),
        new Player(4, Status.EMPTY),
        new Player(5, Status.EMPTY)
    ];

    this.setActive = function () {

    };

    this.addWaitingPlayers = function() {

    };

    // Use ALL to get total number of players
    this.getNumberOfPlayers = function(status, matchesStatus) {
        var playerNum = 0;
        for (var i = 0; i < this.players.length; i++) {
            if (matchesStatus && this.players[i].status === status){
                playerNum++;
            } else if (!matchesStatus && this.players[i].status !== status) {
                playerNum++;
            } else if (status === "ALL") {
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
}

module.exports = {
    Player: Player,
    Status : Status,
    PlayerCollection : PlayerCollection
};