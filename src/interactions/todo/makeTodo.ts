import {
	ActionRowBuilder,
	CommandInteraction,
	Message,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from "discord.js";
import Interaction from "../../libs/structures/Interaction";

export default class MakeTodo extends Interaction {
	name = "make-todo";
	description = "Make a daily todo.json";

	async execute(interaction: CommandInteraction, _message: Message) {
		if (!interaction.isChatInputCommand()) return;

		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId("makeTodoModal")
			.setTitle("Create a Todo");

		// Add components to modal

		// Create the text input components
		const titleInput = new TextInputBuilder()
			.setCustomId("titleInput")
			// The label is the prompt the user sees for this input
			.setLabel("Title of the todo")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const descriptionInput = new TextInputBuilder()
			.setCustomId("descriptionInput")
			.setLabel("Contents of the todo")
			// Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph)
			.setMaxLength(255)
			.setRequired(false);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const titleActionRow = new ActionRowBuilder<
			ModalActionRowComponentBuilder
		>().addComponents(titleInput);
		const descriptionActionRow = new ActionRowBuilder<
			ModalActionRowComponentBuilder
		>().addComponents(descriptionInput);

		// Add inputs to the modal
		modal.addComponents(titleActionRow, descriptionActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);

		return;
	}
}
