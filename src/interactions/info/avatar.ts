import { CommandInteraction, SlashCommandUserOption } from "discord.js";
import Interaction from "../../libs/structures/Interaction";

export default class Avatar extends Interaction {
	name = "avatar";
	description = "Get the avatar URL of the selected user, or your own avatar.";
	userOp = new SlashCommandUserOption()
		.setName("target")
		.setDescription("The user's avatar to show");
	options: any[] = [this.userOp];

	async execute(interaction: CommandInteraction) {
		const user = interaction.options.getUser("target");
		if (user) {
			return interaction.reply(
				`${user.username}'s avatar: ${user.displayAvatarURL({
					forceStatic: false
				})}`
			);
		}
		return interaction.reply(
			`Your avatar: ${interaction.user.displayAvatarURL({
				forceStatic: false
			})}`
		);
	}
}
