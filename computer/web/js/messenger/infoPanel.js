export function loadInfoPanel(chatData) {
  $(".user_info_caunt_div").html(null);

  $('.chat-info-panel .chat-profile .chat-avatar').attr('src', chatData.avatar);
  $('.chat-info-panel .chat-profile .chat-name-info').text(chatData.name);

  window.electronAPI.sendMessage({
    type: "get_info_users", 
    users: chatData.participants,
    _type: "info_panel"
  });

  $('.chat-info-panel #users_on_chat_caunt_chat_info').text(chatData.participants.length);
  $('.chat-info-panel #time_chat_info').text(chatData.createdAt);
  $('.chat-info-panel #type_chat_info').text(chatData.type);
  $('.chat-info-panel #desc_chat_info').text(chatData.desc);

  if (user.id == chatData.owner) {
    $('.chat-info-panel #owner_chat_info').text(user.name);
  } else {
    $('.chat-info-panel #owner_chat_info').html(null);

    window.electronAPI.sendMessage({
      type: "get_info_user", 
      id: chatData.owner,
      _type: 'simple'
    });
  }
}

export function renderUserOnInfoPanel(users) {
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

export function renderNameInInfoPanel(chatData) {
  $('.chat-info-panel #owner_chat_info').text(chatData.name);
}
