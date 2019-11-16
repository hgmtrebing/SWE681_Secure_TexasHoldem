
function Player (balance) {
    this.balance = balance;
    this.status = "";
    this.cardA = null;
    this.cardB = null;
}

module.exports = {
    Player: Player
};