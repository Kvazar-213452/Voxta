import { fastDecrypt, getKeyLite } from './SPX_CriptoLite';
import { safeParseJSON } from "../utils";

export function autoDecrypt(type: string, data: any) {
  let goodData;

  if (type === 'm1') {
    goodData = fastDecrypt(data, getKeyLite().privateKey);
  } else if (type === 'm0') {
    goodData = data;
  } else if (type === 'm2') {
    goodData = data;
  }

  return safeParseJSON(goodData);
}
