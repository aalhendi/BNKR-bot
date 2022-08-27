import { ModalSubmitInteraction } from "discord.js";
import createEmbed from "./createEmbed";
import { allowedTodoEmojis } from "./emojiLists";
import { db } from "./prisma";

export default async function makeTodo(interaction:ModalSubmitInteraction){
				const title = interaction.fields.getTextInputValue("titleInput");
				const description = interaction.fields.getTextInputValue(
					"descriptionInput"
				);
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
								content: description,
								authorId: foundUser.id
							}
						});
						const replyMessage = await interaction.reply({
							embeds: [
								createEmbed().addFields([
									{
										name: "Title",
										value: todo.title
									},
									{
										name: "Content",
										value: !!todo.content ? todo.content : "null"
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
							],
							fetchReply: true
						});
						allowedTodoEmojis
							.slice(0, -2) // All but last 2 emojis. (used for confirm delete)
							.forEach(async (e) => await replyMessage.react(e));
					} catch (error) {
						console.log(error);
					}
				} else {
					const replyContent = foundUser
						? "Must be a title issue."
						: "Something went wrong... Is your user linked with /link-user?";
					await interaction.reply({
						content: replyContent,
						ephemeral: true
					});
				}
}
