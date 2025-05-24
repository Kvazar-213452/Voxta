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

    login?: number;
  }
}

// T = 1
// F = 0
// ERROR = 2

export default CONFIG;