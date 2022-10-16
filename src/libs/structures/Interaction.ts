import {
	ContextMenuCommandBuilder,
	ContextMenuCommandType,
	SlashCommandBuilder
} from "@discordjs/builders";
import {
	ApplicationCommandType,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	//RESTPostAPIApplicationCommandsJSONBody,
	RESTPostAPIContextMenuApplicationCommandsJSONBody
} from "discord.js";
import DiscordClient from "../../client";

export default class Interaction {
	readonly client: DiscordClient;
	name: string = "";
	description: string = "No description provided.";
	options: any[] = [];
	subcommands: any[] = [];
	dmPermission: boolean | undefined;
	commandType: number = 1; // 1 for slash, 0 for context menu
	contextMenuCommandType: ContextMenuCommandType =
		ApplicationCommandType.Message;
	constructor(client: DiscordClient) {
		this.client = client;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	execute(..._args: unknown[]) {
		throw new Error("Unsupported operation.");
	}

	toJSON():
		| RESTPostAPIContextMenuApplicationCommandsJSONBody
		| RESTPostAPIChatInputApplicationCommandsJSONBody {
		if (this.commandType === 0) {
			// context menu
			const command = new ContextMenuCommandBuilder()
				.setName(this.name)
				.setType(this.contextMenuCommandType)
				.setDMPermission(this.dmPermission)
			return command.toJSON();
		} else if (this.commandType === 1) {
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
		} else {
			throw Error("Unknown command type");
		}
	}
}
