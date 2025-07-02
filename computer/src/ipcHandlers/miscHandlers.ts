import { loadIndexTemplate } from '../internal/utils/utils';
import { getStatus } from '../internal/services/status/statusController';

export function handleMisc(msg: any): boolean {
  if (msg.type === 'load_template') {
    loadIndexTemplate();
    return true;
  } else if (msg.type === 'get_status_user') {
    getStatus(msg.user_id);
    return true;
  }
  return false;
}
