
    $('#sendBtn').click(function() {
        const name = $('#name').val();
        const pasw = $('#pasw').val();

        window.electronAPI.sendMessage({
        type: "login", 
        name: name, 
        pasw: pasw
        });
    });

    window.electronAPI.onMessage((msg) => {
        console.log('Відповідь від сервера:', msg);
        alert(JSON.stringify(msg, null, 2));
    });

window.electronAPI.onSendWeb((data) => {
  console.log(data);
});

