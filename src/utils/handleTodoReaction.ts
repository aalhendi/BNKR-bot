import { MessageReaction, User } from "discord.js";
import getTodoId from "./getTodoId";
import { db } from "./prisma";

export default async function handleTodoReaction(
	reaction: MessageReaction,
	user: User
): Promise<void> {
	const foundUser = await db.user.findUnique({
		where: {
			discordId: user.id
		}
	});
	const todoId = getTodoId(reaction.message.embeds);
	if (foundUser && todoId) {
		const todo = await db.todo.findUnique({
			where: {
				id: todoId
			}
		});
		if (todo && todo.authorId === foundUser.id) {
			// Can edit
			let status = todo.status;
			switch (reaction.emoji.name) {
				case "✅":
					status = "Complete";
					break;
				case "✏️":
					status = "Partial";
					break;
				case "❌":
					status = "Incomplete";
					break;

				default:
					break;
			}
			if (reaction.emoji.name === "🗑") {
				await reaction.message.react("‼️");
				await reaction.message.react("🚯");
			} else if (reaction.emoji.name === "‼️") {
				await reaction.message.delete();
				await db.todo.delete({
					where: {
						id: todoId
					}
				});
			} else if (reaction.emoji.name === "🚯") {
				try {
					await reaction.message.reactions.cache.get("‼️")?.remove();
					await reaction.message.reactions.cache.get("🚯")?.remove();
					// NOTE: Wastebin emoji will stay reacted by user because its too much work to remove the reaction. Don't want to spam API
				} catch (error) {
					console.error(error);
				}
			} else {
				await db.todo.update({
					where: {
						id: todoId
					},
					data: {
						status: status
					}
				});
				const embeds = reaction.message.embeds;
				const statusFieldIdx = embeds[0].fields.findIndex(
					(f) => f.name === "Status"
				);
				embeds[0].fields[statusFieldIdx].value = status;
				await reaction.message.edit({ embeds: embeds });
				await reaction.users.remove(user);
			}
		}
	}
}
