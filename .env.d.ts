export {};

declare global {
  namespace NodeJS {
  interface ProcessEnv {
    TOKEN: string;
	CLIENT_ID: string;
	GUILD_ID: string;
	NODE_ENV: string;
	API_KEY: string;
		}
	}
}
