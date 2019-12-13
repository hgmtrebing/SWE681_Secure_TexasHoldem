/**
 * SWE 681 - Fall 2019
 * Final Project - Secure Texas Hold'Em
 * Harry Trebing and Pravin Gurung
 */

module.exports = {
    TestResult: function (passed, message) {
        if (typeof passed === 'boolean' && typeof message === 'string') {
            this.passed = passed;
            this.message = message;
        } else {
            this.passed = null;
            this.message = null;
        }

        this.toString = function() {
            return "Passed: " + this.passed + ". " + this.message;
        }
    }
};
