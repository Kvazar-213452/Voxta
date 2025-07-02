import { updateSettingsUI } from '../modal/settings.js';
import { toggleTheme } from '../misc.js';
import { showUserNamePopup } from '../userFunc.js';

export function handleMisc(data) {
  if (data.type === "theme_load" && data.theme === "white") {
    toggleTheme();
  } else if (data.type === "get_settings") {
    settings = data.settings;
    updateSettingsUI();
  } else if (data.type === "get_user") {
    user = data.user;
    user_id = data.user._id;
  } else if (data.type === "get_status_user") {
    console.log(data.status);
  } else if (data.type === "info_user_profile") {
    console.log(data.user);
    showUserNamePopup(data.user, $(thisShowUserNamePopup));
  }
}
