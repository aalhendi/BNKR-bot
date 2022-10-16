import {
	ActionRowBuilder,
	MessageActionRowComponentBuilder,
	ButtonBuilder,
	ButtonStyle
} from "discord.js";

export const todoButtons =
	new ActionRowBuilder<MessageActionRowComponentBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("setTodoComplete")
				.setLabel("Done!")
				.setStyle(ButtonStyle.Success)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId("setTodoPartial")
				.setLabel("In Progress")
				.setStyle(ButtonStyle.Primary)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId("setTodoIncomplete")
				.setLabel("Not Done")
				.setStyle(ButtonStyle.Secondary)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId("deleteTodo")
				.setLabel("Delete")
				.setStyle(ButtonStyle.Danger)
		);
export const confirmButtons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("cancelTodoDelete")
                    .setLabel("Cancel Delete")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("confirmTodoDelete")
                    .setLabel("Confirm Delete")
                    .setStyle(ButtonStyle.Danger)
            );