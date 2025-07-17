import {
  showFriendModal,
  closeFriendModal,
  openAddFriendMoadl,
  closeAddFriendMoadl,
  findFriend
} from '../modal/friends.js';

$(document).ready(function () {
  $('#friendsBtn').on('click', showFriendModal);
  $('#closefriends').on('click', closeFriendModal);

  $('#addFriendBtnAuk').on('click', openAddFriendMoadl);
  $('#closefriendsAddAuk').on('click', closeAddFriendMoadl);

  $('#input_find_friend').on('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      findFriend($(this).val());
    }
  });
});
