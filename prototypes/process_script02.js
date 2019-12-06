
process.on('message', function(msg){
    console.log(count);
});

var count = 0;

while(count < 900000000) {
    count++;
}

