$(document).ready(function () {
        let username = sessionStorage.getItem('user');
        let token = sessionStorage.getItem('token');
        console.log(username);
        if (username == null) {
                window.location.replace("/login");
        } else {
                $("#username").text(username);
        }


        $("#log_out").click(function () {
                //call logout to server to deletet the token and so on... 
                socket.disconnect();
                sessionStorage.clear();
                window.location.replace("/login");
        })


        let socket = io.connect('https://localhost:8080', {
                transportOptions: {
                  polling: {
                    extraHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                  }
                }
              });

        socket.on('unauthorized', (error, callback) => {
                if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
                        console.log('User token has expired');
                }
        });

        //listen for the event
        socket.on('check', function (value) {
                $("#result").text(value.message);
        })


});