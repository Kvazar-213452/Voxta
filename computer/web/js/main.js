const chats = {
    1: {
        name: "Анна Мельник",
        avatar: "АМ",
        status: "онлайн",
        messages: [
            { sender: "other", content: "Привіт! Як справи? Давно не бачились!", time: "14:30" },
            { sender: "own", content: "Привіт! Все добре, дякую. А у тебе як?", time: "14:31" },
            { sender: "other", content: "Теж все чудово! Хочеш зустрітись на каві цими вихідними?", time: "14:32" }
        ]
    },
    2: {
        name: "Петро Коваленко",
        avatar: "ПК",
        status: "онлайн",
        messages: [
            { sender: "other", content: "Привіт! Не забудь про нашу зустріч", time: "13:40" },
            { sender: "own", content: "Звичайно! О котрій?", time: "13:42" },
            { sender: "other", content: "Зустрічаємось завтра о 15:00", time: "13:45" }
        ]
    }
};

let currentChatId = 1;

$(document).ready(function() {
    loadChat(currentChatId);

    $('#chatsList').on('click', '.chat-item', function() {
        const chatId = parseInt($(this).data('chat'));
        selectChat(chatId);
    });

    $('#sendBtn').on('click', sendMessage);
    $('#messageInput').on('keypress', function(e) {
        if (e.which === 13) sendMessage();
    });

    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('.chat-item').each(function() {
            const chatName = $(this).find('.chat-name').text().toLowerCase();
            const lastMessage = $(this).find('.last-message').text().toLowerCase();
            $(this).toggle(chatName.includes(searchTerm) || lastMessage.includes(searchTerm));
        });
    });
});

function selectChat(chatId) {
    $('.chat-item').removeClass('active');
    $(`[data-chat="${chatId}"]`).addClass('active');
    currentChatId = chatId;
    loadChat(chatId);
}

function loadChat(chatId) {
    const chat = chats[chatId];
    if (!chat) return;

    $('#currentChatName').text(chat.name);
    $('#onlineStatus').text(chat.status);
    $('.chat-header .avatar').text(chat.avatar);

    const $container = $('#messagesContainer');
    $container.empty();
    chat.messages.forEach(msg => addMessageToChat(msg, false));
    scrollToBottom();
}

function addMessageToChat(message, isNew = true) {
    const $msg = $('<div>', { class: `message ${message.sender === 'own' ? 'own' : ''}` });
    const chat = chats[currentChatId];

    if (message.sender === 'own') {
        $msg.html(`
            <div>
                <div class="message-content">${message.content}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `);
    } else {
        $msg.html(`
            <div class="avatar">${chat.avatar}</div>
            <div>
                <div class="message-content">${message.content}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `);
    }

    $('#messagesContainer').append($msg);
    if (isNew) scrollToBottom();
}

function sendMessage() {
    const content = $('#messageInput').val().trim();
    if (!content) return;

    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    const message = { sender: 'own', content: content, time: time };
    chats[currentChatId].messages.push(message);
    addMessageToChat(message, true);

    const $chatItem = $(`[data-chat="${currentChatId}"]`);
    $chatItem.find('.last-message').text(content);
    $chatItem.find('.chat-time').text(time);

    $('#messageInput').val('');
    setTimeout(simulateResponse, Math.random() * 2000 + 1000);
}

function simulateResponse() {
    const responses = [
        "Цікаво!", "Зрозуміло 👍", "Дякую за інформацію", "Добре, домовились",
        "Гарна ідея!", "Можна детальніше?", "Звучить чудово!"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    const message = { sender: 'other', content: randomResponse, time: time };
    chats[currentChatId].messages.push(message);
    addMessageToChat(message, true);

    const $chatItem = $(`[data-chat="${currentChatId}"]`);
    $chatItem.find('.last-message').text(randomResponse);
    $chatItem.find('.chat-time').text(time);
}

function scrollToBottom() {
    const $container = $('#messagesContainer');
    $container.scrollTop($container.prop('scrollHeight'));
}

function showSettings() {
    alert('Налаштування - функція в розробці');
}

function logout() {
    if (confirm('Ви впевнені, що хочете вийти?')) {
        alert('Вихід з системи...');
    }
}