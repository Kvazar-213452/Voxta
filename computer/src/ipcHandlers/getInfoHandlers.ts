import { getStatus } from '../internal/services/status/statusController';
import { getInfoUser } from '../internal/services/chat/utils/getInfo';

export function handleGetInfo(msg: any): boolean {
  if (msg.type === 'get_status_user') {
    getStatus(msg.user_id);
    return true;
  } else if (msg.type === 'get_info_user_profile') {
    getInfoUser(msg.id, "get_info_user_return_profile");
    return true;
  } else if (msg.type === 'get_status_user_profile') {
    getStatus(msg.user_id, "get_status_user_profile");
    return true;
  } 

  return false;
}
