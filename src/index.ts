import "dotenv/config";
import DiscordClient from "./client";
// import Database from "./database";

// const database = new Database();
// const client = new DiscordClient(database);
const client = new DiscordClient();

client.once("ready", () => {
	console.log(`Ready! Logged in as ${client.user?.tag}`);
});
