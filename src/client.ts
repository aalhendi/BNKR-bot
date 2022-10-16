import { Client, GatewayIntentBits, Partials } from "discord.js";
import EventHandler from "./handlers/eventHandler";
import InteractionHandler from "./handlers/interactionHandler";
import SettingHandler from "./handlers/settingHandler";

export default class DiscordClient extends Client {
	public caches = {};

	public settings = new SettingHandler(this);
	public events = new EventHandler(this);
	public interactions = new InteractionHandler(this);

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.DirectMessageReactions
			],
			partials: [Partials.Message, Partials.Channel, Partials.Reaction]
		});

		this.login(process.env.TOKEN!);
	}
}
