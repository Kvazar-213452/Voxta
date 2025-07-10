import { loadIndexTemplate } from '../internal/utils/utils';

export function handleMisc(msg: any): boolean {
  if (msg.type === 'load_template') {
    loadIndexTemplate();
    return true;
  } 

  return false;
}
