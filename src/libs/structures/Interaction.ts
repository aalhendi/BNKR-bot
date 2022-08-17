import { SlashCommandBuilder } from "@discordjs/builders";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import DiscordClient from "../../client";

export default class Interaction {
	readonly client: DiscordClient;
	name: string = "";
	description: string = "No description provided.";
	options: any[] = [];
	subcommands: any[] = [];
	dmPermission: boolean | undefined;

	constructor(client: DiscordClient) {
		this.client = client;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	execute(..._args: unknown[]) {
		throw new Error("Unsupported operation.");
	}

	toJSON(): RESTPostAPIApplicationCommandsJSONBody {
		const command = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description!);

		command.setDMPermission(this.dmPermission);

		this.options.forEach((option) => {
			command.options.push(option);
		});

		this.subcommands.forEach((subcommand) => {
			command.addSubcommand(subcommand);
		});

		return command.toJSON();
	}
}
