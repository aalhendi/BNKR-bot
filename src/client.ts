import { Client, GatewayIntentBits, Partials } from "discord.js";
import EventHandler from "./handlers/eventHandler";
import InteractionHandler from "./handlers/interactionHandler";
import SettingHandler from "./handlers/settingHandler";
// import Database from "./database";

export default class DiscordClient extends Client {
	public caches = {};

	// public readonly database: Database;
	public settings = new SettingHandler(this);
	public events = new EventHandler(this);
	public interactions = new InteractionHandler(this);

	// constructor(database: Database) {
	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMessageReactions
			],
			partials: [Partials.Message, Partials.Channel, Partials.Reaction]
		});

		// this.database = database;
		this.login(process.env.TOKEN!);
	}
}
