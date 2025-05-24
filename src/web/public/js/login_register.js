// login_register.js

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
            if (response == 1) {
                window.location.href = '/register_end';
            }
        }
    });
}

function register_end() {
    let code = $("#code_input").val();

    $.ajax({
        url: "/register_end_post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({data: [code]}),
        success: function (response) {
            if (response == 1) {
                window.location.href = '/';
            }
        }
    });
}
