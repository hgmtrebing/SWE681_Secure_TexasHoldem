$(document).ready(function () {
    socketConnection.connect("https://localhost:8081");
    let username = sessionStorage.getItem('user');
    let token = sessionStorage.getItem('token');
    let _id = sessionStorage.getItem('userId');
    //console.log(username);
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
        url: "/api/user/profile/" + _id,
        type: "GET",
        dataType: "text",
        beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer ' + token);
        },
        success: function (data) {
            result = JSON.parse(data);
            //    console.log(result);
            if (result) {
                user.amount = result.balance;
                user.win = result.win;
                user.games = result.GamePlayed;
                user.tie = result.tie;
                user.loss = result.loss;
                // console.log(user);
                $("#user_amount").text("$" + user.amount);
                $("#game_won").text(user.win);
                $("#game_num").text(user.games);
                $("#game_loss").text(user.tie);
                $("#game_tied").text(user.loss);
            } else {
                window.location.replace("/login");
            }
        },
        error: function () {

        }
    });


    $("#log_out").click(function () {
        //call logout to server to deletet the token and so on... 
        socketConnection.disconnect();
        sessionStorage.clear();
        window.location.replace("/login");
    })


    // let socket = io.connect('https://localhost:8080', {
    //     transportOptions: {
    //         polling: {
    //             extraHeaders: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         }
    //     }
    // });

    let store = [];
 

    function appendDataToGameTable(item, index) {
        console.log(item);
        let number = index + 1;
        let tableName = item.tableName;
        let players = item.players;
        let join = '';
        if (item.joinAllowed) {
            join = '<button id="joinBtn" value=' + item.tableId + ' class="btn btn-primary">Join Table</button>'
        }
        $("#table_of_items tbody").remove(); 
        $('#game_table_data').append(`<tr>
        <th scope="row">`+ number + `</th>
        <td>`+ tableName + `</td>
        <td>`+ players + `</td>
        <td>`+ join + `</td>
      </tr>`);
    }

    socketConnection.on('unauthorized', (error, callback) => {
        if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
            console.log('User token has expired');
        }
    });


    $("#createRoombtn").click(function () {
        alert("New Table button clicked");
        socketConnection.emit("create-table", {
            username: username,
            token: token,
            userId: _id
        });
    })
    //listening to failure to create table message
    socketConnection.on("create-table-failure", function () {
        alert("Create Table Failed. There are too many tables");
    });
    //listening to successfully created table message
    socketConnection.on("create-table-success", function () {
        alert("New Table Successfully Created");
    });
    //listening to enter-table
    socketConnection.on("join-table-success", function (msg) {
        window.open(msg.url,"_self");
    });

    socketConnection.on('home-page-update-message', function(data){
        store =data;
        if(store.length >0){
            store.forEach(appendDataToGameTable);
        }
    })

    $("body").on('click', '#joinBtn', function (e) {
        let id = e.target.value;
        console.log(id);
        socketConnection.emit("join-table", {
            username: username,
            token: token,
            userId: _id,
            tableId: id
        });
    });


});