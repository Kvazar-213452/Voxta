import { getSettings } from '../../models/sqliteStorage/serviseUtils/settings';
import { 
  getKeyLite, 
  fastEncrypt, 
  getPublicKeyServerLite, 
  initKeyLite, 
  getPublicKeyServerLiteSIS 
} from '../../utils/crypto/SPX_CriptoLite';

let countCryptoM1: number = 0;
let countCryptoM2: number = 0;

function getPublicKeyServerLiteSISAsync(chatId: string): Promise<string> {
  return new Promise((resolve) => {
    getPublicKeyServerLiteSIS(chatId, (key) => {
      resolve(key);
    });
  });
}

export async function autoCrypto(message: any, type: string, data: any) {
  let settings: Settings | null = getSettings();
  let key: string | undefined;
  let msg: any;
  let crypto: string | undefined;

  if (type === 'online') {
    if (settings?.cripto === 'm1') {
      const { packet } = fastEncrypt(JSON.stringify(message), await getPublicKeyServerLite());
      key = getKeyLite().publicKey;
      msg = packet;
      crypto = settings.cripto;

      if (countCryptoM1 > 5) initKeyLite();
    } else if (settings?.cripto === 'm2') {

      if (countCryptoM2 > 5) initKeyLite();
    }
  } else if (type === 'server') {
    if (settings?.cripto === 'm1') {
      const keyPub = await getPublicKeyServerLiteSISAsync(data.chatId);
      const { packet } = fastEncrypt(JSON.stringify(message), keyPub);
      key = getKeyLite().publicKey;
      msg = packet;
      crypto = settings.cripto;
      if (countCryptoM2 > 5) initKeyLite();
    } else if (settings?.cripto === 'm2') {

      if (countCryptoM2 > 5) initKeyLite();
    }
  }

  return {
    key,
    msg,
    crypto
  };
}
