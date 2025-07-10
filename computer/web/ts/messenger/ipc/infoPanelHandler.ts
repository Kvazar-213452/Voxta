import { renderUserOnInfoPanel, renderNameInInfoPanel } from '../infoPanel.js';

export function handleInfoPanel(data) {
  if (data.type === 'info_users') {
    renderUserOnInfoPanel(data.users);
  } else if (data.type === 'info_user') {
    renderNameInInfoPanel(data.user);
  }
}
