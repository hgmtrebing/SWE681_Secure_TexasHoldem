$(document).ready(function () {
        let username = sessionStorage.getItem('user');
        let token = sessionStorage.getItem('token');
        let _id = sessionStorage.getItem('userId');
        console.log(username);
        if (username == null) {
                window.location.replace("/login");
        } else {
                $("#username").text(username);
        }
        let user = {
                username: username,
                token: token,
                userId: _id
        }
        //ajax call to get the data
        $.ajax({
                url: "/api/user/profile/"+_id,
                type: "GET",
                dataType: "text",
                beforeSend: function (xhr) {   //Include the bearer token in header
                        xhr.setRequestHeader("Authorization", 'Bearer '+ token);
                    },
                success : function(data) {
                    result =JSON.parse(data);
                //    console.log(result);
                    if(result){
                        user.amount = result.balance;
                        user.win = result.win;
                        user.games = result.GamePlayed;
                        user.tie  = result.tie;
                        user.loss = result.loss;
                        console.log(user);
                        $("#user_amount").text("$" +user.amount);
                        $("#game_won").text(user.win);
                        $("#game_num").text(user.games);
                        $("#game_loss").text(user.tie);
                        $("#game_tied").text(user.loss);
                    }else{
                        window.location.replace("/login");
                    }
                },
                error : function() {

                }
            });


        $("#log_out").click(function () {
                //call logout to server to deletet the token and so on... 
                socket.disconnect();
                sessionStorage.clear();
                window.location.replace("/login");
        })


        // let socket = io.connect('https://localhost:8080', {
        //         transportOptions: {
        //           polling: {
        //             extraHeaders: {
        //                 Authorization: `Bearer ${token}`
        //             }
        //           }
        //         }
        //       });

        // socket.on('unauthorized', (error, callback) => {
        //         if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
        //                 console.log('User token has expired');
        //         }
        // });

        // //listen for the event
        // socket.on('check', function (value) {
        //         $("#result").text(value.message);
        // })


});