import {
	CommandInteraction,
	Message,
	SlashCommandStringOption
} from "discord.js";
import { allowedTodoEmojis } from "../../utils/emojiLists";
import Interaction from "../../libs/structures/Interaction";
import createEmbed from "../../utils/createEmbed";
import { db } from "../../utils/prisma";

export default class MakeTodo extends Interaction {
	name = "make-todo";
	description = "Make a daily todo.json";
	titleOp = new SlashCommandStringOption()
		.setName("title")
		.setDescription("title of todo")
		.setMaxLength(128)
		.setRequired(true);
	contentOp = new SlashCommandStringOption()
		.setName("content")
		.setDescription("description of todo")
		.setMaxLength(256)
		.setRequired(false);
	options = [this.titleOp, this.contentOp];

	async execute(interaction: CommandInteraction, message: Message) {
		if (!interaction.isChatInputCommand()) return;

		const title = interaction.options.getString("title");
		const content = interaction.options.getString("content");
		const discordUserId = interaction.user.id;

		const foundUser = await db.user.findUnique({
			where: {
				discordId: discordUserId
			}
		});

		if (title && foundUser) {
			try {
				const todo = await db.todo.create({
					data: {
						title: title,
						content: content,
						authorId: foundUser.id
					}
				});
				await interaction.editReply({
					embeds: [
						createEmbed().addFields([
							{
								name: "Title",
								value: todo.title
							},
							{
								name: "Content",
								value: todo.content ?? "null"
							},
							{
								name: "Status",
								value: todo.status
							},
							{
								name: "Created At",
								value: todo.createdAt.toISOString()
							},
							{
								name: "ID",
								value: todo.id
							}
						])
					]
				});
				allowedTodoEmojis
					.slice(0, -2) // All but last 2 emojis. (used for confirm delete)
					.forEach(async (e) => await message.react(e));
			} catch (error) {
				console.log(error);
			}
		} else {
			await interaction.deleteReply();
			const replyContent = foundUser
				? "Must be a title issue."
				: "Something went wrong... Is your user linked with /link-user?";
			await interaction.followUp({
				content: replyContent,
				ephemeral: true
			});
		}

		return;
	}
}
