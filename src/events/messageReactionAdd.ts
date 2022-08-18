import {allowedTodoEmojis} from "../utils/emojiLists"
import { MessageReaction, User } from "discord.js";
import Event from "../libs/structures/Event";
import handleTodoReaction from "../utils/handleTodoReaction";

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
		if (
			reaction.emoji.name &&
			allowedTodoEmojis.includes(reaction.emoji.name) &&
			reaction.message.author?.id === process.env.CLIENT_ID
		) {
		  handleTodoReaction(reaction, user)

		}
	}
}
