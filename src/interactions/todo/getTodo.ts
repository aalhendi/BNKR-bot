import { CommandInteraction, SlashCommandStringOption } from "discord.js";
import Interaction from "../libs/structures/Interaction";
import createEmbed from "../utils/createEmbed";
import { db } from "../utils/prisma";

export default class GetTodo extends Interaction {
	name = "get-todo";
	description = "Get a todo by ID";
	idOp = new SlashCommandStringOption()
		.setName("id")
		.setDescription("id of todo")
		.setMaxLength(128)
		.setRequired(true);
	options = [this.idOp];

	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const id = parseInt(interaction.options.getString("id") ?? "-1");
		const discordUserId = interaction.user.id;

		const foundUser = await db.user.findUnique({
			where: {
				discordId: discordUserId
			}
		});

		if (foundUser) {
			try {
				const todo = await db.todo.findUnique({
					where: {
						id: id
					}
				});
				if (todo) {
					await interaction.editReply({
						embeds: [
							createEmbed().addFields([
								{
									name: "Title",
									value: todo.title
								},
								{
									name: "Content",
									value: todo.content ?? ""
								},
								{
									name: "Is Complete?",
									value: todo.isComplete ? "yes" : "no"
								},
								{
									name: "Created At",
									value: todo.createdAt.toISOString()
								}
							])
						]
					});
				} else {
					await interaction.deleteReply();
					interaction.followUp({
						content: "Could not find todo",
						ephemeral: true
					});
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			await interaction.deleteReply();
			await interaction.followUp({
				content: "Something went wrong... is your user linked with /link-user?",
				ephemeral: true
			});
		}

		return;
	}
}
