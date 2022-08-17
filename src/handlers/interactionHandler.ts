import DiscordClient from "../client";
import { join } from "path";
import Interaction from "../libs/structures/Interaction";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import getAllFiles from "../utils/getAllFiles";
import { Collection } from "discord.js";
import "dotenv/config";

export default class InteractionHandler extends Collection<
	string,
	Interaction
> {
	client: DiscordClient;

	constructor(client: DiscordClient) {
		super();

		this.client = client;

		this.init();
	}

	private async init() {
		const folder = "interactions";
		const path = join(__dirname, "..", folder);
		const files = getAllFiles(path);

		files.forEach((file) => {
			const interactionClass = ((r) => r.default || r)(require(file));
			const command: Interaction = new interactionClass(this.client);

			this.set(command.name, command);
		});
	}

	async delete_guild_command(guildId: string, commandId: string) {
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
		try {
			rest.delete(
				Routes.applicationGuildCommand(
					process.env.CLIENT_ID!,
					guildId,
					commandId
				)
			);
			console.log("Successfully deleted guild command");
		} catch (error) {
			console.error(error);
		}
	}

	async delete_global_command(commandId: string) {
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
		try {
			rest.delete(Routes.applicationCommand(process.env.CLIENT_ID!, commandId));
			console.log("Successfully deleted application command");
		} catch (error) {
			console.error(error);
		}
	}

	async deploy() {
		try {
			console.log("Started refreshing application (/) commands.");
			const commands = this.map((c) => c.toJSON());
			const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

			const guilds = this.client.guilds.cache;

			guilds.forEach(async (guild) => {
				await rest.put(
					Routes.applicationGuildCommands(process.env.CLIENT_ID!, guild.id),
					{
						body: commands
					}
				);
			});
			console.log("Successfully reloaded application (/) commands.");
		} catch (error) {
			console.log(error);
		}
	}
}
