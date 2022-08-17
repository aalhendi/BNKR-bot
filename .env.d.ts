export {};

declare global {
  namespace NodeJS {
  interface ProcessEnv {
    TOKEN: string;
	CLIENT_ID: string;
	GUILD_ID: string;
	MONGO_URI: string;
	MONGO_DB: string;
	NODE_ENV: string;
		}
	}
}
