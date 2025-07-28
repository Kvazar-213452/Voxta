export function showUserNamePopup(user, $targetElement, status) {
  const $popup = $('#userNamePopup');

  $('#userNamePopup .avatar_p').attr('src', user.avatar);
  $('#userNamePopup .user_info_p .user_name_p').html(user.name);
  $('#userNamePopup .user_info_p .user_desc_p').html(user.desc);
  $('#userNamePopup .user_info_p .user_status_p').html(status);

  const rect = $targetElement[0].getBoundingClientRect();
  $popup.css({
    left: rect.left + window.pageXOffset + 'px',
    top: rect.top + window.pageYOffset - $popup.outerHeight() - 8 + 'px',
    display: 'block',
    animation: 'fadeSlideIn 0.3s ease forwards',
  });

  clearTimeout($popup.data('_timeout'));
  const timeoutId = setTimeout(() => {
    $popup.css('animation', 'fadeSlideOut 0.3s ease forwards');

    $popup.one('animationend', () => {
      $popup.css('display', 'none');
    });
  }, 3000);

  $popup.data('_timeout', timeoutId);
}
