// config.ts

const CONFIG = {
    HEAD_SERVER: "http://localhost:3001/",
    PORT: 3000
};

// types

declare module 'express-session' {
  interface SessionData {
    name?: string;
    pasw?: string;
    gmail?: string;
    code?: string;
  }
}

export default CONFIG;