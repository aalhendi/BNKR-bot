import {
	CommandInteraction,
	SlashCommandSubcommandBuilder,
	SlashCommandUserOption
} from "discord.js";
import Interaction from "../../libs/structures/Interaction";

export default class Avatar extends Interaction {
	name = "info";
	description = "Get infor about a user or the server";
	userOp = new SlashCommandUserOption()
		.setName("target")
		.setDescription("The user");
	userSubCommand = new SlashCommandSubcommandBuilder()
		.setName("user")
		.setDescription("Info about a user")
		.addUserOption(this.userOp);
	serverSubCommand = new SlashCommandSubcommandBuilder()
		.setName("server")
		.setDescription("Info about the server");
	subcommands = [this.serverSubCommand, this.userSubCommand];

	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const subcommand = interaction.options.getSubcommand();
		if (subcommand == "server") {
			await interaction.editReply(
				`Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`
			);
		} else if (subcommand == "user") {
			const user = interaction.options.getUser("target");
			if (user) {
				await interaction.editReply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.editReply(
					`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`
				);
			}
		}
		return;
	}
}
