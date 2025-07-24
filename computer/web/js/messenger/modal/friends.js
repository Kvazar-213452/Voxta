export function showFriendModal() {
  $('#friendsModal').addClass('active');

  window.electronAPI.sendMessage({
    type: 'get_friends',
    _type: 'modal_friends'
  });
}

export function closeFriendModal() {
  $('#friendsModal').removeClass('active');
}

export function renderFriends(data) {
  $('#user_modal_friends').html(null);

  for (const id in data) {
    const user = data[id];
    let content = `
      <div class='user_info_div'>
        <img class='logo' src='${user.avatar}'>
        <p class='name'>${user.name}</p>
        <div onclick="delFriend(${user.id})" class='delete_friend_btn'></div>
      </div>
    `;
    
    $('#user_modal_friends').append(content);
  }
}

export function delFriend(id) {
  window.electronAPI.sendMessage({
    type: 'del_friend',
    id: id
  });
}

export function openAddFriendMoadl() {
  $('#friendsModalAddAuk').addClass('active');
}

export function closeAddFriendMoadl() {
  $('#friendsModalAddAuk').removeClass('active');
  closeFriendModal();
}

export function findFriend(name) {
  window.electronAPI.sendMessage({
    type: 'find_friend',
    name: name
  });
}

function addFriend(id) {
  window.electronAPI.sendMessage({
    type: 'add_friend',
    id: id
  });
}

window.delFriend = delFriend;
