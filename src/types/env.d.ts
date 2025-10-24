declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
