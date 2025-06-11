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
});
