var Actions = {
    CHECK : "CHECK",
    FOLD : "FOLD",
    LEAVE : "LEAVE",
    RAISE : "RAISE",
    CALL : "CALL",
    ALLIN : "ALLIN",
    TIMEOUT : "TIMEOUT"
};


var Rounds = {
    INACTIVE : "INACTIVE",
    WAITING : "WAITING",
    SETUP : "SETUP",
    BET : "BET",
    FLOP : "FLOP",
    TURN : "TURN",
    RIVER : "RIVER",
    FINAL : "FINAL",
    CLEANUP : "CLEANUP"
};

/**
 *
 * @type {{FOLDED: string, ALL: string, ACTIVE: string, EMPTY: string}}
 */
var Status = {
    ALL : "ALL",
    EMPTY : "EMPTY",
    ACTIVE : "ACTIVE",
    FOLDED : "FOLDED",
    ALLIN : "ALLIN"
};

module.exports = {
    Status : Status,
    Rounds : Rounds,
    Actions : Actions
};
