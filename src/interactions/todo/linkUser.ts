import { CommandInteraction } from "discord.js";
import Interaction from "../../libs/structures/Interaction";
import { db } from "../../utils/prisma";

export default class LinkUser extends Interaction {
	name = "link-user";
	description = "link discord username to db";

	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;
		const discordId = interaction.user.id;
		const discordName = interaction.user.tag;

		try {
			const foundUser = await db.user.findUnique({
				where: {
					discordId: discordId
				}
			});
			if (foundUser) {
				interaction.deleteReply();
				interaction.followUp({
					content: "Already linked",
					ephemeral: true
				});
				return;
			}
			await db.user.create({
				data: {
					discordId: discordId,
					discordName: discordName
				}
			});
		} catch (error) {
			console.log(error);
			interaction.deleteReply();
			interaction.followUp({
				content: "Something went wrong...",
				ephemeral: true
			});
			return;
		}

		interaction.deleteReply();
		interaction.followUp({
			content: "Successfully linked!",
			ephemeral: true
		});
		return;
	}
}
