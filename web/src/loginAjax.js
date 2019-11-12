$(document).ready(function(){
    $("#submit-button").on("click", function () {
        if ($("#user-name").val() == "" || $("#user-name").val() == null || $("#user-name").val() == undefined || $("#password").val() == "" || $("#password").val() == null || $("#password").val() == undefined){
            $("#error-message").text("Username and password field are required.")
            $("#error-message").show();
        }else{
            // make an ajax call to the server
            
            $("#error-message").hide();
            alert("Successfully Logged In");
            $("#user-name").val("");
            $("#password").val("")
        }

    });
});