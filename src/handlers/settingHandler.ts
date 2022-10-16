import { Collection } from "discord.js";
import DiscordClient from "../client";
import { GuildSettings } from "../libs/entities/GuildSettings";

// const collection = "guilds";

export default class SettingHandler extends Collection<string, GuildSettings> {
	readonly client: DiscordClient;

	constructor(client: DiscordClient) {
		super();

		this.client = client;
	}
}
