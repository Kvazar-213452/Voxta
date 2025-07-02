import { updateSettingsUI } from '../modal/settings.js';
import { toggleTheme } from '../other.js';

export function handleRest(data) {
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
  }
}

// window.electronAPI.sendMessage({
//   type: "get_status_user", 
//   user_id: "1243243423",
// });
