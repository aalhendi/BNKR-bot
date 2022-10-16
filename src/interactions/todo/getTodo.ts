import {
	CommandInteraction,
	SlashCommandStringOption
} from "discord.js";
import Interaction from "../../libs/structures/Interaction";
import createEmbed from "../../utils/createEmbed";
import { db } from "../../utils/prisma";
import { todoButtons } from "../../utils/todoButtons";

export default class GetTodo extends Interaction {
	name = "get-todo";
	description = "Get a todo by ID";
	idOp = new SlashCommandStringOption()
		.setName("id")
		.setDescription("id of todo")
		.setMinLength(36)
		.setMaxLength(36)
		.setRequired(true);
	options = [this.idOp];

	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const todoId = interaction.options.getString("id") ?? "null";
		const discordUserId = interaction.user.id;

		if (todoId.length !== 36) {
			await interaction.reply({
				content: "todo ids are 36 chars",
				ephemeral: true
			});
			return;
		}

		const foundUser = await db.user.findUnique({
			where: {
				discordId: discordUserId
			}
		});

		if (foundUser) {
			try {
				const foundTodo = await db.todo.findUnique({
					where: {
						id: todoId
					}
				});
				if (foundTodo) {
					if (foundTodo.authorId !== foundUser.id) {
						await interaction.reply({
							content: "Something went wrong...",
							ephemeral: true
						});
					}
					await interaction.reply({
						embeds: [
							createEmbed().addFields([
								{
									name: "Title",
									value: foundTodo.title
								},
								{
									name: "Content",
									value: foundTodo.content ?? "null"
								},
								{
									name: "Status",
									value: foundTodo.status
								},
								{
									name: "Created At",
									value: foundTodo.createdAt.toISOString()
								},
								{
									name: "ID",
									value: foundTodo.id
								}
							])
						],
						components: [todoButtons] // Action buttons for todo item
					});
				} else {
					await interaction.reply({
						content: "Could not find todo",
						ephemeral: true
					});
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			await interaction.reply({
				content:
					"Something went wrong... Could not find user. is your user linked with /link-user?",
				ephemeral: true
			});
		}

		return;
	}
}
