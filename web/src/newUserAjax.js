var validCharacters = /^[a-zA-Z0-9]{5,}$/;
$(document).ready(function(){

    $("#submit-button").on("click", function () {

        var errors = false;
        if ($("#user-name").val() == "" || ($("#user-name").val() == null || $("#user-name").val() == undefined)) {
            $("#empty-username").css("display", "block");
            errors = true;
        } else {
            $("#empty-username").css("display", "none");
        }

        if ($("#user-name").val().length < 5) {
            $("#short-username").css("display", "block");
            errors = true;
        } else {
            $("#short-username").css("display", "none");
        }

        if ($("#user-name").val().length > 20) {
            $("#long-username").css("display", "block");
            errors = true;
        } else {
            $("#long-username").css("display", "none");
        }

        if (!validCharacters.test( $("#user-name").val() )) {
            $("#invalid-username").css("display", "block");
            errors = true;
        } else {
            $("#invalid-username").css("display", "none");
        }

        if ($("#password-01").val() !== $("#password-02").val()) {
            $("#password-mismatch").css("display", "block");
            errors = true;
        }

        if (!errors) {

            var username = $("#user-name").val();
            var password = $("#password-01").val();
            var new_user_request = {
                "username" : username,
                "password" : password
            };

            $.ajax({
                url: "/new-user",
                type: "POST",
                data: new_user_request,
                dataType: "text",

                success : function(completeHtmlPage) {
                    $("html").empty();
                    $("html").append(completeHtmlPage);
                },
                error : function() {
                    alert("An error has been encountered! Please try again.");
                }
            });
        }
    });
});
