$(document).ready(function(){
        let username = sessionStorage.getItem('user');
        console.log(username);
        if(username == null){
                window.location.replace("/login");
        }else{
                $("#username").text(username);
        }


        $("#log_out").click(function(){
               //call logout to server to deletet the token and so on... 
              sessionStorage.clear();
              window.location.replace("/login");
        })

});