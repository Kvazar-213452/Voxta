import { getStatus } from '../services/status/statusController';
import { getInfoUser, getInfoUsers } from '../services/chat/utils/getInfo';
import { getFriengs } from '../services/chat/utils/friend';

export function handleGetInfo(msg: any): boolean {
  if (msg.type === 'get_status_user') {
    getStatus(msg.user_id, 'simple');
    return true;
  } else if (msg.type === 'get_status_user_profile') {
    getStatus(msg.userId, "profile");
    return true;
  } else if (msg.type === 'get_info_users') {
    getInfoUsers(msg.users, msg._type);
    return true;
  } else if (msg.type === 'get_info_user') {
    getInfoUser(msg.id, msg._type);
    return true;
  } else if (msg.type === 'get_friends') {
    getFriengs(msg._type);
    return true;
  }

  return false;
}
