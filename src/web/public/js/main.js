// main.js

$(document).ready(function () {
    const $textarea = $('.input_message textarea');

    $textarea.on('input', function () {
        $(this).height('auto');

        const scrollHeight = this.scrollHeight;
        const maxHeight = $(window).height() - 400;

        if (scrollHeight < maxHeight) {
            $(this).css({
                'overflow-y': 'hidden',
                'height': scrollHeight + 'px'
            });
        } else {
            $(this).css({
                'overflow-y': 'auto',
                'height': maxHeight + 'px'
            });
        }
    });
});
