import { getStatus } from '../services/status/statusController';
import { getInfoUser, getInfoUsers } from '../services/chat/utils/getInfo';

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
  } else if (msg.type === 'get_info_users') {
    getInfoUsers(msg.users);
    return true;
  } else if (msg.type === 'get_info_user') {
    getInfoUser(msg.id, 'simple');
    return true;
  }

  return false;
}
