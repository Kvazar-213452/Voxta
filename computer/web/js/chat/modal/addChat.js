function showAddChat() {
  $('#addChatModal').addClass('active');
}

function closeAddChat() {
  $('#addChatModal').removeClass('active');
}

// moadl
$(document).ready(function() {
    let selectedPrivacy = 'private';

    $('.privacy-option').on('click', function() {
        $('.privacy-option').removeClass('selected');
        $(this).addClass('selected');
        selectedPrivacy = $(this).data('privacy');

        const hint = $('.privacy-options').next('.form-hint');
        if (selectedPrivacy === 'private') {
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
                preview.attr('src', e.target.result).addClass('show');
                label.addClass('has-file').html(`
                    <span>✅</span>
                    <span>${file.name}</span>
                `);
            };
            reader.readAsDataURL(file);
        } else {
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
        const chatName = $('#chatName').val().trim();
        const chatDescription = $('#chatDescription').val().trim();
        const avatarFile = $('#chatAvatar')[0].files[0];

        const newChat = {
            name: chatName,
            description: chatDescription,
            privacy: selectedPrivacy,
            avatar: avatarFile ? avatarFile.name : null,
            createdAt: new Date().toISOString()
        };

        console.log('Створюється новий чат:', newChat);

        $('#createChatForm')[0].reset();
        $('.privacy-option').removeClass('selected');
        $('[data-privacy="private"]').addClass('selected');
        $('#avatarPreview').removeClass('show');
        $('#avatarLabel').removeClass('has-file').html(`
            <span>📷</span>
            <span>Оберіть зображення для аватару</span>
        `);
        selectedPrivacy = 'private';
        $('#createBtn').prop('disabled', true);

        closeAddChat();
    });

    $('#createChatForm').on('submit', function(e) {
        e.preventDefault();
        $('#createBtn').click();
    });
});


// createBtn