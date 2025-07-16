
export function showSettingsChat() {
  window.electronAPI.sendMessage({
    type: "load_chat_info_for_settings", 
    id: chat_id_select,
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

  console.log(data)
}

export function renderUsersInChatSettings(users) {
  $("#users_modal_settings_chat").html(null);

  for (const id in users) {
    const user = users[id];
    let content = `
      <div class="user_info_div">
        <img class="logo" src="${user.avatar}">
        <p class="name">${user.name}</p>
      </div>
    `;
    
    $("#users_modal_settings_chat").append(content);
  }
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




$(document).ready(function() {
    let avatarBase64 = null;

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
