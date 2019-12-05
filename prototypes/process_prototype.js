const childProcess = require("child_process");
const process = require('process');

//const child = childProcess.execFile("./process_script01.js");
const child = childProcess.fork('process_script02.js' );
const child2 = childProcess.fork('process_script02.js' );
child.send({msgtype:"EMPTY"});
child.send({msgtype:"EMPTY"});
child.send({msgtype:"EMPTY"});
child.send({msgtype:"EMPTY"});
child2.send({msgtype:"EMPTY"});
child2.send({msgtype:"EMPTY"});
child2.send({msgtype:"EMPTY"});
child2.send({msgtype:"EMPTY"});
console.log("Messages sent");

/*
child.stdout.on('data', function (data) {
    console.log(`${data}`);
});

child.on('exit', function (code, signal) {
    console.log('child process exited with ' +
        `code ${code} and signal ${signal}`);
});
 */
