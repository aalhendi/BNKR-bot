import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Interaction,
	MessageActionRowComponentBuilder
} from "discord.js";
import createEmbed from "./createEmbed";
import { db } from "./prisma";

export default async function handleBookmark(
	interaction: Interaction
): Promise<void> {
	const foundUser = await db.user.findUnique({
		where: {
			discordId: interaction.user.id
		}
	});
	if (interaction.isMessageContextMenuCommand() && foundUser) {
		const messageUrl = interaction.targetMessage.url;
		await db.bookmark.upsert({
			where: {
				ownerId_url: {
					ownerId: foundUser.id,
					url: messageUrl
				}
			},
			create: {
				ownerId: foundUser.id,
				url: messageUrl
			},
			update: {}
		});
		await interaction.user.send({
			content: messageUrl,
			embeds: [
				createEmbed({
					author: {
						name: interaction.targetMessage.author?.username ?? "null",
						icon_url: interaction.targetMessage.author?.avatarURL() ?? ""
					},
					description: interaction.targetMessage.content ?? ""
				})
			],
			components: [deleteButton]
		});
	} else if (
		foundUser &&
		interaction.isMessageComponent() &&
		interaction.customId === "deleteBookmark"
	) {
		await interaction.update({
			// update the interaction with new delete buttons
			components: [confirmButtons]
		});
	} else if (
		foundUser &&
		interaction.isMessageComponent() &&
		interaction.customId === "cancelBookmarkDelete"
	) {
		await interaction.update({
			// update the interaction with new delete buttons
			components: [deleteButton]
		});
	} else if (
		foundUser &&
		interaction.isMessageComponent() &&
		interaction.customId === "confirmBookmarkDelete"
	) {
		if (
			interaction.user.dmChannel &&
			interaction.message.client.user &&
			interaction.message.author &&
			interaction.message.author.id === interaction.message.client.user.id &&
			interaction.message.content
		) {
			const foundBookmark = await db.bookmark.findUnique({
				where: {
					ownerId_url: {
						ownerId: foundUser.id,
						url: interaction.message.content
					}
				}
			});
			foundBookmark &&
				(await db.bookmark.delete({
					where: {
						ownerId_url: {
							ownerId: foundUser.id,
							url: interaction.message.content
						}
					}
				}));
			await interaction.message.delete();
		}
	}
	return;
}

const confirmButtons = new ActionRowBuilder<MessageActionRowComponentBuilder>()
	.addComponents(
		new ButtonBuilder()
			.setCustomId("cancelBookmarkDelete")
			.setLabel("Cancel Delete")
			.setStyle(ButtonStyle.Secondary)
	)
	.addComponents(
		new ButtonBuilder()
			.setCustomId("confirmBookmarkDelete")
			.setLabel("Confirm Delete")
			.setStyle(ButtonStyle.Danger)
	);

const deleteButton =
	new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("deleteBookmark")
			.setLabel("Delete")
			.setStyle(ButtonStyle.Danger)
	);
