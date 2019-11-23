var carddeckTest = require('./carddeckTest');
var rankingTest = require('./rankingTest');

function main() {
    var testResults = [];
    testResults = testResults.concat(carddeckTest.runAllTests());
    testResults = testResults.concat(rankingTest.runAllTests());

    for (var testResult in testResults) {
        console.log(testResults[testResult].toString() + "\n");
    }
}

main();
