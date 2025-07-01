function loadInfoPanel(chatData) {
  $(".user_info_caunt_div").html(null);

  $('.chat-info-panel .chat-profile .chat-avatar').attr('src', chatData.avatar);
  $('.chat-info-panel .chat-profile .chat-name-info').text(chatData.name);

  if (chatData.type === "online") {
    $('.chat-info-panel .chat-profile .chat-type-online').text(chatData.type);
  } else {
    $('.chat-info-panel .chat-profile .chat-type-offline').text(chatData.type);
  }

  window.electronAPI.sendMessage({
    type: "get_info_users", 
    users: chatData.participants,
  });

  $('.chat-info-panel #users_on_chat_caunt_chat_info').text(chatData.participants.length);
  $('.chat-info-panel #time_chat_info').text(chatData.createdAt);
  $('.chat-info-panel #type_chat_info').text(chatData.type);
}

function renderUserOnInfoPanel(users) {
  for (const id in users) {
    const user = users[id];
    let content = `
      <div class="user_info_div">
        <img class="logo" src="${user.avatar}">
        <p class="name">${user.name}</p>
      </div>
    `;
    
    $(".user_info_caunt_div").append(content);
  }
}
