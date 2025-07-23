let usersInChat;
let avatarBase64 = null;

export function showSettingsChat() {
  window.electronAPI.sendMessage({
    type: "load_chat_info_for_settings", 
    id: chat_id_select,
    typeChat: chat_select['type']
  });
}

export function closeSettingsChat() {
  $('#settingsChatModal').removeClass('active');
}

export function renderInfoChatSettings(data) {
  window.electronAPI.sendMessage({
    type: "get_info_users", 
    users: data.participants,
    _type: "chat_settings"
  });

  window.electronAPI.sendMessage({
      type: "get_info_user", 
      id: data.owner,
      _type: 'chat_settings_admin'
  });

  $('#chatDescription_settings').val(data.desc);
  $('#chatName_settings').val(data.name);

  $('#avatarPreview_settings').attr('src', data.avatar).addClass('show');
  $('#avatarLabel_settings').addClass('has-file').html(`
    <span>✅</span>
    <span>good</span>
  `);

  $('#chat_settings_time').html(data.createdAt);
  $('#chat_settings_type').html(data.type);
}

export function renderUsersInChatSettings(users) {
  $("#users_modal_settings_chat").html(null);

  let content;
  usersInChat = users;

  for (const id in users) {
    const user = users[id];
    content = `
      <div class="user_info_div">
        <img class="logo" src="${user.avatar}">
        <p class="name">${user.name}</p>
        <div onclick="delMember(${user.id})" class='delete_friend_btn'></div>
      </div>
    `;
    
    $("#users_modal_settings_chat").append(content);
  }

  content = `
    <div onclick="openModaladdUserInChat()" class='user_info_div add_user_in_chat_div'>
      <p class='add_user_in_chat'>Додати користувача +</p>
    </div>
  `;

  $('#users_modal_settings_chat').prepend(content);
}

export function renderUserChatSettings(user) {
  let content = `
    <div class="user_info_div">
    <img class="logo" src="${user.avatar}">
    <p class="name">${user.name}</p>
    </div>
  `;

  $("#user_modal_settings_chat").html(content);
}

function openModaladdUserInChat() {
  window.electronAPI.sendMessage({
    type: 'get_friends', 
    _type: 'add_friend_in_chat',
  });
}

export function opneModalAddFriendInChat(friends) {
  const userIdsInChat = Object.keys(usersInChat);
  const uniqueFriends = friends.filter(id => !userIdsInChat.includes(id));

  window.electronAPI.sendMessage({
    type: 'get_info_users',
    _type: 'friends_add_chat_modal_render',
    users: uniqueFriends
  });
}

export function opneModalAddFriendInChatRender(friends) {
  $("#modal_friends_add_in_chat").html(null);

  for (const id in friends) {
    const user = friends[id];
    let content = `
      <div onclick="addFriendInChat(${user.id})" class="user_info_div add_user_in_chat_div">
        <img class="logo" src="${user.avatar}">
        <p class="name">${user.name}</p>
      </div>
    `;
    
    $("#modal_friends_add_in_chat").append(content);
  }

  $('#friendsModalAdd').addClass('active');
}

function addFriendInChat(id) {
  window.electronAPI.sendMessage({
    type: 'add_user_in_chat',
    id: chat_id_select,
    userId: id,
    typeChat: chat_select['type']
  });

  $('#friendsModalAdd').removeClass('active');
  closeSettingsChat();
}

function delMember(id) {
  window.electronAPI.sendMessage({
    type: 'del_user_in_chat',
    id: chat_id_select,
    userId: id,
    typeChat: chat_select['type']
  });

  closeSettingsChat();
}

export function saveSettingsChat() {
  let data = {
    name: $('#chatName_settings').val(),
    desc: $('#chatDescription_settings').val(),
    avatar: avatarBase64
  };

  window.electronAPI.sendMessage({
    type: 'save_chat_settings',
    id: chat_id_select,
    dataChat: data,
    typeChat: chat_select['type']
  });

  closeSettingsChat();
}

export function closeSettingsChatAddMember() {
  $('#friendsModalAdd').removeClass('active');
}







$(document).ready(function() {
  $('#chatAvatar_settings').on('change', function() {
    const file = this.files[0];
    const label = $('#avatarLabel_settings');
    const preview = $('#avatarPreview_settings');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarBase64 = e.target.result;
            preview.attr('src', avatarBase64).addClass('show');
            label.addClass('has-file').html(`
                <span>✅</span>
                <span>${file.name}</span>
            `);
        };
        reader.readAsDataURL(file);
    } else {
        avatarBase64 = null;
        preview.removeClass('show');
        label.removeClass('has-file').html(`
            <span>📷</span>
            <span>Оберіть зображення для аватару</span>
        `);
    }
  });

  $('#chatName_settings').on('input', function() {
    const createBtn = $('#createBtn');
    const value = $(this).val().trim();
    
    if (value) {
        createBtn.prop('disabled', false);
    } else {
        createBtn.prop('disabled', true);
    }
  });
});


window.openModaladdUserInChat = openModaladdUserInChat;
window.addFriendInChat = addFriendInChat;
window.delMember = delMember;