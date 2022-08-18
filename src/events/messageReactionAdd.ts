import { Embed, MessageReaction, User } from "discord.js";
import { db } from "../utils/prisma";
import Event from "../libs/structures/Event";

export default class RessageReactionAdd extends Event {
	name = "messageReactionAdd";

	async execute(reaction: MessageReaction, user: User): Promise<void> {
		// When a reaction is received, check if the structure is partial
		if (reaction.partial) {
			// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
			try {
				await reaction.fetch();
			} catch (error) {
				console.error("Something went wrong when fetching the message:", error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}
		// TODO: have sets of allowedEmojis, swtich case on which function based on which list has emoji
		// l1 [a, b, c] case l1: function1(){}... etc
		const allowedEmojis: Array<string> = ["✅", "✏️", "❌"];

		if (
			reaction.emoji.name &&
			allowedEmojis.includes(reaction.emoji.name) &&
			reaction.message.author?.id === process.env.CLIENT_ID
		) {
			const foundUser = await db.user.findUnique({
				where: {
					discordId: user.id
				}
			});
			const todoId = this.getTodoId(reaction.message.embeds);
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
					await reaction.users.remove(user)
				}
			}
		}
	}
	getTodoId(embeds: Embed[]): string | undefined {
		for (let embed of embeds) {
			for (let field of embed.fields) {
				if (field.name == "ID") return field.value;
			}
		}
		return undefined;
	}
}
