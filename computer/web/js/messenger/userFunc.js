export function showUserNamePopup(user, $targetElement) {
  const $popup = $('#userNamePopup');
  $popup.text(user.name);

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
