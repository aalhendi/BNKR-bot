import {
	CommandInteraction,
	SlashCommandStringOption,
} from "discord.js";
import Interaction from "../../libs/structures/Interaction";
import axios from "axios";

export default class Shorten extends Interaction {
	name = "shorten";
	description = "shorten a URL with usuq.lol";
	op1 = new SlashCommandStringOption()
		.setName("url")
		.setDescription("URL to shorten")
		.setRequired(true);
	op2 = new SlashCommandStringOption()
		.setName("slug")
		.setDescription("slug of shortened url")
		.setRequired(true);
	options = [this.op1, this.op2]

	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;
		      const url = interaction.options.getString("url");
		      const slug = interaction.options.getString("slug");
		      if (url && slug) {
			try {
			  const res = await axios.post('https://rax.mov/', {url:url, slug:slug})
			  await interaction.reply(`${res.status}: Success. https://rax.mov/${slug}`);
			} catch (error) {
			  if (axios.isAxiosError(error)){
			    error.response && await interaction.reply(`${error.response.status} ${error.response.statusText}\n ${error.response.data}`);
			  }
			}
		      } else {
			      await interaction.reply(
				      `Huh. Thats an error`
			      );
		      }
	      return;
	}
}
