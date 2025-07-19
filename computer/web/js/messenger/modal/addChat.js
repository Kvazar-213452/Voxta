let selectedPrivacy = 'offline';
let avatarBase64 = null;

export function showAddChat() {
  $('#addChatModal').addClass('active');
}

export function closeAddChat() {
  $('#addChatModal').removeClass('active');
}

function createChat(chat) {
  window.electronAPI.sendMessage({
    type: "create_chat", 
    chat: chat,
  });
}

function openServerModalChatAdd() {
  $('#serverModalChatAdd').addClass('active');
}

export function closeServerModalChatAdd() {
  $('#serverModalChatAdd').removeClass('active');
}

export function createServerChat() {
  const chatName = $('#chatName').val().trim();
  const chatDescription = $('#chatDescription').val().trim();

  const newChat = {
    name: chatName,
    description: chatDescription,
    privacy: 'server',
    avatar: avatarBase64,
    createdAt: new Date().toISOString(),
    idServer: $('#idServer').val(),
    codeServer: $('#codeServer').val()
  };

  window.electronAPI.sendMessage({
    type: "create_chat_server", 
    chat: newChat,
  });

  _reset();
  closeServerModalChatAdd();
  closeAddChat();
}

function _reset() {
    $('#createChatForm')[0].reset();
    $('.privacy-option').removeClass('selected');
    $('[data-privacy="offline"]').addClass('selected');
    $('#avatarPreview').removeClass('show');
    $('#avatarLabel').removeClass('has-file').html(`
        <span>📷</span>
        <span>Оберіть зображення для аватару</span>
    `);
    avatarBase64 = null;
    selectedPrivacy = 'offline';
    $('#createBtn').prop('disabled', true);
}

// moadl window
$(document).ready(function() {
    $('.privacy-option').on('click', function() {
        $('.privacy-option').removeClass('selected');
        $(this).addClass('selected');
        selectedPrivacy = $(this).data('privacy');

        const hint = $('.privacy-options').next('.form-hint');
        if (selectedPrivacy === 'offline') {
            hint.text('Приватні чати видимі тільки вам');
        } else {
            hint.text('Публічні чати можуть бачити інші користувачі');
        }
    });

    $('#chatAvatar').on('change', function() {
        const file = this.files[0];
        const label = $('#avatarLabel');
        const preview = $('#avatarPreview');

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

    $('#chatName').on('input', function() {
        const createBtn = $('#createBtn');
        const value = $(this).val().trim();
        
        if (value) {
            createBtn.prop('disabled', false);
        } else {
            createBtn.prop('disabled', true);
        }
    });

    $('#createBtn').on('click', function() {
        if (selectedPrivacy === 'server') {
            openServerModalChatAdd();
        } else {
            const chatName = $('#chatName').val().trim();
            const chatDescription = $('#chatDescription').val().trim();

            const newChat = {
                name: chatName,
                description: chatDescription,
                privacy: selectedPrivacy,
                avatar: avatarBase64,
                createdAt: new Date().toISOString()
            };

            createChat(newChat);
            _reset();
            closeAddChat();
        }
    });

    $('#createChatForm').on('submit', function(e) {
        e.preventDefault();
        $('#createBtn').click();
    });
});


// createBtn