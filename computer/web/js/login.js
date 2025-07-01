// login

$('#sendBtn').click(function() {
  const name = $('#name').val();
  const pasw = $('#pasw').val();

  window.electronAPI.sendMessage({
    type: "login", 
    name: name, 
    pasw: pasw
  });
});

// register

$('#sendBtn1').click(function() {
  const name = $('#name').val();
  const pasw = $('#pasw').val();
  const gmail = $('#gmail').val();

  window.electronAPI.sendMessage({
    type: "register", 
    name: name,
    pasw: pasw,
    gmail: gmail
  });
});

window.electronAPI.onMessage((msg) => {
  if (msg["type"] == "register" && msg["code"] == 1) {
    window.location.href = "registerVeref.html";
  }
});
