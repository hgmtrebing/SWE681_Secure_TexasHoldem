var validCharacters = /^[a-zA-Z0-9]{5,20}$/;
$(document).ready(function(){

    $("#back-button").click(function () {
        window.location.replace("/");
    });

    $("#submit-button").on("click", function () {
        let clientSideCheckPass = true;
        usrname = $("#user-name").val();
        passwrd =$("#password-01").val(); 
        repasswrd = $("#password-02").val();
        if(usrname == "" || usrname == null || usrname == undefined){
            $("#username-error-message").text("Username is a required field");
            $("#username-error-message").addClass("alert alert-warning");
            clientSideCheckPass = false;
        }else if(!validateUsername(usrname)){
            $("#username-error-message").text("Invalid Username. Please enter a valid username.");
            $("#username-error-message").addClass("alert alert-warning");
            clientSideCheckPass = false;
        }else{
            $("#username-error-message").text("");
            $("#username-error-message").removeClass("alert alert-warning");
        }

        if(passwrd == "" || passwrd == null || passwrd == undefined){
            $("#password-error-message").text("Password is a required field");
            $("#password-error-message").addClass("alert alert-warning");
            clientSideCheckPass = false;
        }else if(!validatePassword(passwrd)){
            $("#password-error-message").text("Invalid Password. Please enter a valid password.");
            $("#password-error-message").addClass("alert alert-warning");
            clientSideCheckPass = false;
        }else{
            $("#password-error-message").text("");
            $("#password-error-message").removeClass("alert alert-warning");
        }

        if(repasswrd == "" || repasswrd == null || repasswrd == undefined){
            $("#reenter-passwrd-error-message").text("Re-enter Password is a required field");
            $("#reenter-passwrd-error-message").addClass("alert alert-warning");
            clientSideCheckPass = false;
        }else if(validatePassword(passwrd) && passwrd !== repasswrd){
            $("#reenter-passwrd-error-message").text("Password and Re-enter Password does not match.");
            $("#reenter-passwrd-error-message").addClass("alert alert-warning");
            clientSideCheckPass = false;
        }else{
            $("#reenter-passwrd-error-message").text("");
            $("#reenter-passwrd-error-message").removeClass("alert alert-warning");
        }
        var new_user_request = {
            "username" : usrname,
            "password" : passwrd
        };
        if(clientSideCheckPass){
            $.ajax({
                url: "/api/user/new-user",
                type: "POST",
                data: new_user_request,
                dataType: "text",
                success : function(data) {
                    result =JSON.parse(data);
                    console.log(result);
                    if(result.success){
                        $("#error-message").text(result.message);
                        $("#error-message").removeClass("alert-warning");
                        $("#error-message").addClass("alert alert-success");
                        window.location.replace("/login");
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
        }
        $("#user-name").val("");
        $("#password-01").val(""); 
        $("#password-02").val("");

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
