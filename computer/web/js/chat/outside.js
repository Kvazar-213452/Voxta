function msg_send_pc() {
  new Notification("Voxta", {
    body: "Це тестове сповіщення",
    icon: "img/icon.png"
  });
}

function reconnectSocketClient() {
  window.electronAPI.sendMessage({
    type: "reconnect_socket_client"
  });
}
