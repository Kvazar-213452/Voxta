function loadInfoPanel(chatData) {
  console.log(chatData)
  $('.chat-info-panel .chat-profile .chat-avatar').attr('src', chatData.avatar);
  $('.chat-info-panel .chat-profile .chat-name-info').text(chatData.name);

  if (chatData.type === "online") {
    $('.chat-info-panel .chat-profile .chat-type-online').text(chatData.type);
  } else {
    $('.chat-info-panel .chat-profile .chat-type-offline').text(chatData.type);
  }
}