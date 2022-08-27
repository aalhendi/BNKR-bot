import { CommandInteraction, SlashCommandStringOption } from "discord.js";
import Interaction from "../libs/structures/Interaction";

export default class Timestamp extends Interaction {
	name = "timestamp";
	description = "create a timestamp";
	dd = new SlashCommandStringOption().setName("dd").setDescription("day");
	MM = new SlashCommandStringOption().setName("mm").setDescription("month");
	yyyy = new SlashCommandStringOption().setName("yyyy").setDescription("year");
	hh = new SlashCommandStringOption().setName("hh").setDescription("hours");
	mm = new SlashCommandStringOption().setName("mins").setDescription("minutes");
	options = [this.dd, this.MM, this.yyyy, this.hh, this.mm];

	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		let dd = interaction.options.getString("dd");
		let MM = interaction.options.getString("mm");
		let yy = interaction.options.getString("yy");
		let hh = interaction.options.getString("hh");
		let mm = interaction.options.getString("mins");
		const now = new Date();
		if (!dd) {
			dd = now.getDate().toString().padStart(2, "0");
		}
		if (!MM) {
			MM = (now.getMonth() + 1).toString();
		}
		if (!yy) {
			yy = now.getFullYear().toString();
		}
		if (!hh){
		  hh = now.getHours().toString().padStart(2, '0')
		}
		if (!mm){
		  mm = now.getMinutes().toString().padStart(2, '0')
		}
		const ts = new Date(`${MM}-${dd}-${yy}-${hh}:${mm}`).getTime().toString();

		await interaction.editReply({
			content: `
${`\`<t:${ts.substring(0, ts.length - 3)}:${"t"}>\``} ${`<t:${ts.substring(
				0,
				ts.length - 3
			)}:${"t"}>`}
${`\`<t:${ts.substring(0, ts.length - 3)}:${"T"}>\``} ${`<t:${ts.substring(
				0,
				ts.length - 3
			)}:${"T"}>`}
${`\`<t:${ts.substring(0, ts.length - 3)}:${"d"}>\``} ${`<t:${ts.substring(
				0,
				ts.length - 3
			)}:${"d"}>`}
${`\`<t:${ts.substring(0, ts.length - 3)}:${"D"}>\``} ${`<t:${ts.substring(
				0,
				ts.length - 3
			)}:${"F"}>`}
${`\`<t:${ts.substring(0, ts.length - 3)}:${"f"}>\``} ${`<t:${ts.substring(
				0,
				ts.length - 3
			)}:${"f"}>`}
${`\`<t:${ts.substring(0, ts.length - 3)}:${"F"}>\``} ${`<t:${ts.substring(
				0,
				ts.length - 3
			)}:${"F"}>`}
${`\`<t:${ts.substring(0, ts.length - 3)}:${"R"}>\``} ${`<t:${ts.substring(
				0,
				ts.length - 3
			)}:${"R"}>`}
		  `
		});
	}
}
