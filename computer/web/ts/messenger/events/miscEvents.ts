$(document).on('click', '.avatar.info_profile_bnt', function(this: HTMLElement) {
  const id = $(this).data('user-id');
  if (id) {
    window.AppData.thisShowUserNamePopup = this;
    window.AppData.selectIdUserProfile = id;

    window.electronAPI.sendMessage({
      type: "get_status_user_profile", 
      user_id: id,
    })
  }
});
