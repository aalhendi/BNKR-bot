import {
	CommandInteraction,
	Message,
	MessageReaction,
	SlashCommandStringOption,
	User
} from "discord.js";
import Interaction from "../../libs/structures/Interaction";
import createEmbed from "../../utils/createEmbed";
import { db } from "../../utils/prisma";

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

	async execute(interaction: CommandInteraction, message: Message) {
		if (!interaction.isChatInputCommand()) return;

		const todoId = interaction.options.getString("id") ?? "null";
		const discordUserId = interaction.user.id;

		if (todoId.length !== 36) {
			await interaction.deleteReply();
			await interaction.followUp({
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
						await interaction.deleteReply();
						await interaction.followUp({
							content: "Something went wrong...",
							ephemeral: true
						});
					}
					await interaction.editReply({
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
									name: "Is Complete?",
									value: foundTodo.isComplete ? "yes" : "no"
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
						]
					});
					await message.react("✅");
					await message.react("✏️");
					await message.react("❌");
				} else {
					await interaction.deleteReply();
					await interaction.followUp({
						content: "Could not find todo",
						ephemeral: true
					});
					const filter = (reaction: MessageReaction, user: User) => {
						return (
							["✅", "✏️", "❌"].includes(reaction.emoji.name!) &&
							user.id === interaction.user.id
						);
					};
					await message
						.awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
						.then((collected) => {
							const reaction = collected.first();

							if (reaction && reaction.emoji.name === "✅") {
								message.reply("You reacted with a thumbs up.");
							} else if (reaction && reaction.emoji.name === "✏️") {
								message.reply("You reacted with a thumbs down.");
							} else if (reaction && reaction.emoji.name === "❌") {
								message.reply("You reacted with a thumbs down.");
							}
						})
						.catch(() => {
							message.reply("You reacted with none of the options.");
						});
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			await interaction.deleteReply();
			await interaction.followUp({
				content:
					"Something went wrong... Could not find user. is your user linked with /link-user?",
				ephemeral: true
			});
		}

		return;
	}
}
