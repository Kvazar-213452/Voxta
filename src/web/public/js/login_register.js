// login.js

function login() {
    let name = $("#name_input").val();
    let pasw = $("#password_input").val();

    $.ajax({
        url: "/login_post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({data: [name, pasw]}),
        success: function (response) {
            console.log(response);
        }
    });
}

function register() {
    let name = $("#name_input").val();
    let pasw = $("#password_input").val();
    let gmail = $("#gmail_input").val();

    $.ajax({
        url: "/register_post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({data: [name, pasw, gmail]}),
        success: function (response) {
            console.log(response);
        }
    });
}
