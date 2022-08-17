import { Interaction } from "discord.js";
import Event from "../libs/structures/Event";

export default class interactionCreate extends Event {
	name = "interactionCreate";

	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) {
			// Not a command. Do nothing
			return;
		} else {
			try {
				// Gives bot whatever time it needs to reply
				await interaction.deferReply();
				// Get the command from collection.
				const command = this.client.interactions.get(interaction.commandName);
				if (command) {
					// Run the command
					await command.execute(interaction);
				} else {
					console.log(`Unknown command name ${interaction.commandName}`);
				}
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true
				});
			}
			return;
		}
	}
}
