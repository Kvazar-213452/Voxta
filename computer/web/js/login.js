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

// register veref

$('#sendBtn2').click(function() {
  const code = $('#code').val();

  window.electronAPI.sendMessage({
    type: "register_verification", 
    code: code,
  });
});

window.electronAPI.onMessage((msg) => {
  if (msg["type"] == "register_verification" && msg["code"] == 0) {
    console.log("error")
  }
});
