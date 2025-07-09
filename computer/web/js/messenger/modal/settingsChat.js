

// Color picker
$('.color-option').on('click', function() {
    $('.color-option').removeClass('selected');
    $(this).addClass('selected');
    
    const color = $(this).data('color');
    $(document.documentElement).css('--primary-color', color);
});

// Font size slider
$('#fontSize').on('input', function() {
    $('#fontSizeValue').text($(this).val() + 'px');
});

// Toggle switches
$('.toggle-switch').on('click', function() {
    $(this).toggleClass('active');
});

// Modal close buttons
$('#closeSettingsBtn, #closeSettingsBtn2').on('click', function() {
    $('#settingsModal').hide();
});

// Reset button
$('#resetBtn').on('click', function() {
    // Reset all settings to defaults
    $('.toggle-switch').addClass('active');
    
    $('.color-option').removeClass('selected');
    $('.color-option[data-color="#58ff7f"]').addClass('selected');
    
    $('#fontSize').val(14);
    $('#fontSizeValue').text('14px');
    
    $('#autoDeleteTime').val('never');
    $('#backgroundImage').val('default');
    
    $(document.documentElement).css('--primary-color', '#58ff7f');
});

// Save button
$('#saveBtn').on('click', function() {
    // Here you would save the settings
    alert('Налаштування збережено!');
    $('#settingsModal').hide();
});

// Auto-delete select styling
$('#autoDeleteTime').on('change', function() {
    console.log('Auto-delete time changed to:', $(this).val());
});

// Background image select
$('#backgroundImage').on('change', function() {
    console.log('Background changed to:', $(this).val());
});

export function showSettingsChat() {
  window.electronAPI.sendMessage({
    type: "load_chat_info_for_settings", 
    id: chat_id_select,
  });

  $('#settingsChatModal').addClass('active');
}

export function closeSettingsChat() {
  $('#settingsChatModal').removeClass('active');
}




