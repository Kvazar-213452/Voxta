import {
  showFriendModal,
  closeFriendModal,
} from '../modal/friends.js';

$(document).ready(function () {
  $('#friendsBtn').on('click', showFriendModal);
  $('#closefriends').on('click', closeFriendModal);
});
