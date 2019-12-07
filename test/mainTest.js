var carddeckTest = require('./carddeckTest');
var rankingTest = require('./rankingTest');
var tableTest = require('./tableTest');
var gameServerTest = require('./gameServerTest');

function mainTest() {
    var testResults = [];
    testResults = testResults.concat(carddeckTest.runAllTests());
    testResults = testResults.concat(rankingTest.runAllTests());
    testResults = testResults.concat(tableTest.runAllTests());
    testResults = testResults.concat(gameServerTest.runAllTests());

    for (var testResult in testResults) {
        console.log(testResults[testResult].toString() + "\n");
    }
}

mainTest();
