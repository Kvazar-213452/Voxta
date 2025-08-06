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

// ! ========= add user in a chat =========

export function openModaladdUserInChat() {
  $("#div_find_user").html(null);
  $("#input_find_user").val(null);
  $('#usersModalAdd').addClass('active');
}

export function renderUserAdd(users) {
  $("#div_find_user").html(null);

  for (const id in users) {
    const user = users[id];
    let content = `
      <div onclick="addUserInChat(${user.id})" class="user_info_div add_user_in_chat_div">
        <img class="logo" src="${user.avatar}">
        <p class="name">${user.name}</p>
      </div>
    `;
    
    $("#div_find_user").append(content);
  }
}

function addUserInChat(id) {
  window.electronAPI.sendMessage({
    type: 'add_user_in_chat',
    id: chat_id_select,
    userId: id,
    typeChat: chat_select['type']
  });

  $('#usersModalAdd').removeClass('active');
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
  $('#usersModalAdd').removeClass('active');
}

export function findUser(name) {
  window.electronAPI.sendMessage({
    type: 'find_user',
    name: name,
    id: chat_id_select
  });
}

// ! ======== ready func ========

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


// users_modal_settings_chat


window.openModaladdUserInChat = openModaladdUserInChat;
window.addUserInChat = addUserInChat;
window.delMember = delMember;