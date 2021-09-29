const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Checks the current New World server status")
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("The region of servers")
        .setRequired(true)
        .addChoice("US EAST", "status_USE")
        .addChoice("SA EAST", "status_SAE")
        .addChoice("EU CENTRAL", "status_EUC")
        .addChoice("AP SOUTHEAST", "status_APSW")
        .addChoice("US WEST", "status_USW")
    ),
  async execute(interaction) {
    await interaction.reply(
      // TODO: Finish
      `Status`
    );
  },
};
