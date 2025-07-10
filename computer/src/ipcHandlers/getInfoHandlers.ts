import { getStatus } from '../internal/services/status/statusController';
import { getInfoUser } from '../internal/services/chat/utils/getInfo';

export function handleGetInfo(msg: any): boolean {
  if (msg.type === 'get_status_user') {
    getStatus(msg.user_id, 'simple');
    return true;
  } else if (msg.type === 'get_info_user_profile') {
    getInfoUser(msg.id, "profile");
    return true;
  } else if (msg.type === 'get_status_user_profile') {
    getStatus(msg.userId, "profile");
    return true;
  } 

  return false;
}
