$(document).ready(function(){

    $("#back-button").click(function () {
        window.location.replace("/");
    });
    
    $("#submit-button").on("click", function () {
        usrname = $("#user-name").val();
        passwrd =$("#password").val(); 
        if (usrname == "" || usrname == null || usrname == undefined || passwrd == "" || passwrd == null || passwrd == undefined){
            $("#error-message").text("Username and password field are required.")
            $("#error-message").addClass("alert alert-warning");
        }else if(!validateUsername(usrname) || !validatePassword(passwrd)){ 
            $("#user-name").val("");
            $("#password").val("")
            $("#error-message").text("Invalid Username or password.")
            $("#error-message").addClass("alert alert-warning");
        }else{
            let login_request ={
                "username" : usrname,
               "password" : passwrd
            }
            $.ajax({
                url: "/api/user/login",
                type: "POST",
                data: login_request,
                dataType: "text",
                success : function(data) {
                    result =JSON.parse(data);
                    if(result.success){
                        //save the access token to cahce/session
                        $("#error-message").text(result.message);
                        $("#error-message").removeClass("alert-warning");
                        $("#error-message").addClass("alert alert-success");
                        window.location.replace("/home");
                    }else{
                        $("#error-message").text(result.message);
                        $("#error-message").addClass("alert alert-warning");
                    }
                },
                error : function() {
                        $("#error-message").text("Something went wrong. Please try again later.");
                        $("#error-message").addClass("alert-warning");
                }
            });
            $("#user-name").val("");
            $("#password").val("")
        }

    });
});

//Validate Username for min-char:5, max-char:20, alphanumeric 
function validateUsername(username){
    let validUsername = /^[a-zA-Z0-9]{5,20}$/;
   return validUsername.test(username);
}

//Validate Username for min-char:8, max-char:20, alphanumeric inlcuding chars like @_$*#!. 
function validatePassword(passwrd){
    let validPassword = /^([a-zA-Z0-9@_$*#!.]{8,20})$/; //need to change this later
    return validPassword.test(passwrd);
}