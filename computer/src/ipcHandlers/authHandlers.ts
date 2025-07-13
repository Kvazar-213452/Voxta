import { IpcMainEvent } from 'electron';
import { login } from '../services/authentication';
import { register, registerVerification } from '../services/registration';

export function handleAuth(event: IpcMainEvent, msg: any): boolean {
  if (msg.type === 'login') {
    login(event, msg);
    return true;
  } else if (msg.type === 'register') {
    register(msg);
    return true;
  } else if (msg.type === 'register_verification') {
    registerVerification(msg);
    return true;
  }
  
  return false;
}
