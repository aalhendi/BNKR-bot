import { ModalSubmitInteraction } from "discord.js";
import createEmbed from "./createEmbed";
import { db } from "./prisma";
import { todoButtons } from "./todoButtons";

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
						await interaction.reply({
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
							components: [todoButtons], // Action buttons for todo item
							fetchReply: true
						});
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
