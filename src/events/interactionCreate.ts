import { Interaction, InteractionType } from "discord.js";
import handleTodoButton from "../utils/handleTodoButton";
import Event from "../libs/structures/Event";
import makeTodo from "../utils/makeTodo";
import handleBookmark from "..//utils/handleBookmark";

export default class interactionCreate extends Event {
	name = "interactionCreate";

	async execute(interaction: Interaction) {
		if (interaction.isChatInputCommand()) {
			try {
				// Get the command from collection.
				const command = this.client.interactions.get(interaction.commandName);
				if (command) {
					// Run the command
					command.execute(interaction);
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
		} else if (interaction.type === InteractionType.ModalSubmit) {
			if (interaction.customId === "makeTodoModal") {
				makeTodo(interaction);
			}
		} else if (interaction.isButton()) {
			if (interaction.customId.includes("Bookmark")) {
				handleBookmark(interaction);
			} else if (interaction.message.interaction) {
				if (interaction.message.interaction.commandName.includes("todo")) {
					handleTodoButton(interaction);
				}
			}
		} else if (interaction.isContextMenuCommand()) {
			if (
				interaction.isMessageContextMenuCommand() &&
				interaction.commandName === "bookmark"
			) {
				handleBookmark(interaction);
			}
		}
		return;
	}
}
