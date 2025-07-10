export function msgSendPc() {
  new Notification("Voxta", {
    body: "Це тестове сповіщення",
    icon: "img/icon.png"
  });
}

export function reconnectSocketClient() {
  window.electronAPI.sendMessage({
    type: "reconnect_socket_client"
  });
}

export function toggleTheme() {
  const root = document.documentElement;
  root.setAttribute('data-theme', 'light');
}
