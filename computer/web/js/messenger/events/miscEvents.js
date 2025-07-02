$(document).on('click', '.avatar.info_profile_bnt', function() {
  const id = $(this).data('user-id');
  if (id) {
    thisShowUserNamePopup = this;
    
    window.electronAPI.sendMessage({
      type: "get_info_user_profile", 
      id: id,
    });
  }
});
