import { CommandInteraction } from "discord.js";
import Interaction from "../../libs/structures/Interaction";
import createEmbed from "../../utils/createEmbed";

export default class Help extends Interaction {
	name = "help";
	description = "Display 'helpful' information.";

	async execute(interaction: CommandInteraction) {
		const message = createEmbed({ title: "HELP" }).setDescription(
			`
      Lol... Help yourself.
      `
		);

		return interaction.reply({ embeds: [message] });
	}
}
