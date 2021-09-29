const { SlashCommandBuilder } = require("@discordjs/builders");
const getServerStatus = require("../functions/getServerStatus");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nwstatus")
    .setDescription("Checks the current New World server status")
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("The region of servers")
        .setRequired(true)
        .addChoice("US EAST", "0")
        .addChoice("SA EAST", "1")
        .addChoice("EU CENTRAL", "2")
        .addChoice("AP SOUTHEAST", "3")
        .addChoice("US WEST", "4")
    ),
  async execute(interaction) {
    const region = interaction.options.getString("region");
    try {
      await interaction.deferReply();
      downs = await getServerStatus(region);
      await interaction.editReply(downs.join("\n"));
    } catch (error) {
      console.error(error);
    }
  },
};
