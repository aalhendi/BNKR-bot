import "dotenv/config";
import DiscordClient from "./client";

const client = new DiscordClient();

client.once("ready", () => {
	console.log(`Ready! Logged in as ${client.user?.tag}`);
});
