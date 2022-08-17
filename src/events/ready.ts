import { ActivityType } from "discord.js";
import DiscordClient from "../client";
import Event from "../libs/structures/Event";

export default class Ready extends Event {
	name = "ready";
	once = true;

	async execute(client: DiscordClient): Promise<void> {
		// Deploy slash commands, needs to be run whenever commands change.
		await client.interactions.deploy();
		// Set presence
		client.user?.setPresence({
			status: "online",
			activities: [
				{
					name: "/help",
					type: ActivityType.Listening
				}
			]
		});
	}
}
