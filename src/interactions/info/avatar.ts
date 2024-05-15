import { ApplicationCommandOptionType, CommandInteraction, SlashCommandUserOption } from "discord.js";
import Interaction from "../../libs/structures/Interaction";

export default class Avatar extends Interaction {
	name = "avatar";
	description = "Get the avatar URL of the selected user, or your own avatar.";
	userOp = new SlashCommandUserOption()
		.setName("target")
		.setDescription("The user's avatar to show");
	options: any[] = [this.userOp];

	async execute(interaction: CommandInteraction) {
		const userOption = interaction.options.data.find(option => option.name === 'target' && option.type === ApplicationCommandOptionType.User);
		if (userOption && userOption.type === ApplicationCommandOptionType.User) {
			const user = userOption.user;
			if (user) {
				return interaction.reply(
					`${user.username}'s avatar: ${user.displayAvatarURL({
						forceStatic: false
					})}`
				);
			}
		}
		return interaction.reply(
			`Your avatar: ${interaction.user.displayAvatarURL({
				forceStatic: false
			})}`
		);
	}
}
