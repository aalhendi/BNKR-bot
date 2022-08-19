import { MessageReaction, User } from "discord.js";
import createEmbed from "./createEmbed";
import { db } from "./prisma";

export default async function handleBookmarkReaction(
	reaction: MessageReaction,
	user: User
): Promise<void> {
	const foundUser = await db.user.findUnique({
		where: {
			discordId: user.id
		}
	});
	const messageUrl = reaction.message.url;
	if (foundUser) {
		if (
			reaction.emoji.name === "🚫" &&
			user.dmChannel &&
			reaction.message.author &&
			reaction.message.client.user &&
			reaction.message.author.id === reaction.message.client.user.id &&
			reaction.message.content
		) {
		  const foundBookmark = await db.bookmark.findUnique({
		    where:{
		      ownerId_url:{
			ownerId:foundUser.id,
			url: reaction.message.content
		      }
		    }
		  })
		  foundBookmark && await db.bookmark.delete({
				where: {
					ownerId_url: {
						ownerId: foundUser.id,
						url: reaction.message.content
					}
				}
			});
			await reaction.message.delete();
			return;
		} else {
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
			const message = await user.send({
				content: messageUrl,
				embeds: [
					createEmbed({
						author: {
							name: reaction.message.author?.username ?? "null",
							icon_url: reaction.message.author?.avatarURL() ?? ""
						},
						description: reaction.message.content ?? ""
					})
				]
			});
			await message.react("🚫");
			return;
		}
	}
}
