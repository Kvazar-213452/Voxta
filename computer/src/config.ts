export const config = {
  login_url: "http://localhost:3000/login",
  get_info_to_jwt: "http://localhost:3000/get_info_to_jwt",

  // app
  width: 800,
  height: 600,
};

export const configCrypto = {
  // text
  ALGORITHM: 'aes-256-cbc' as const,
  IV_LENGTH: 16
}

export const configDB = {
  // app db
  SERVICE_NAME: "voxta",
}
