$(document).on('click', '.avatar.info_profile_bnt', function() {
  const id = $(this).data('user-id');
  if (id) {
    thisShowUserNamePopup = this;
    selectIdUserProfile = id;

    window.electronAPI.sendMessage({
      type: "get_status_user_profile", 
      user_id: id,
    })
  }
});
