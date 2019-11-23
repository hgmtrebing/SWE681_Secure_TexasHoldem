
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
