import { getSettings } from '../../models/sqliteStorage/serviseUtils/settings';
import { getKeyLite, fastEncrypt, getPublicKeyServerLite, initKeyLite }from '../../utils/crypto/SPX_CriptoLite';

let countCryptoM1: number = 0;
let countCryptoM2: number = 0;

export async function autoCrypto(message: any) {
  let settings: Settings | null = getSettings();
  let key: string | undefined;
  let msg: any;
  let crypto: string | undefined;

  if (settings && settings.cripto === 'm1') {
    const { packet } = fastEncrypt(JSON.stringify(message), await getPublicKeyServerLite());
    key = getKeyLite().publicKey;
    msg = packet;
    crypto = settings.cripto;

    countCryptoM1 > 5 && initKeyLite();
  } else if (settings && settings.cripto === 'm2') {
    

    countCryptoM2 > 5 && initKeyLite();
  }

  return {
    key: key,
    msg: msg,
    crypto: crypto
  }
}
