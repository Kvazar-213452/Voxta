const CONFIG = {
    port: 3000,
}

declare module 'express-session' {
  interface SessionData {
    name?: string;
    password?: string;
    gmail?: string;
    code?: number
  }
}

export default CONFIG;