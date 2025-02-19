const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const play = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches for a video on YouTube.')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The search query')
        .setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    try {
      const searched = await play.search(query, { source: { youtube: "video" } });
      if (searched.length === 0) {
        await interaction.reply("No videos found.");
        return;
      }

      // Create a response message with up to 10 video links
      let responseMessage = 'Top 10 search results:\n';
      for (let i = 0; i < Math.min(searched.length, 10); i++) {
        const video = searched[i];
        responseMessage += `${i + 1}. [${video.title}](${video.url})\n`;
      }
      //Create embed for the response message
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Top 10 YouTube Search Results')
        .setDescription('Here are the top 10 results for your search query.');

      for (let i = 0; i < Math.min(searched.length, 10); i++) {
        const video = searched[i];
        embed.addFields({ name: `${i + 1}. ${video.title}`, value: `[Watch Here](${video.url})` });
      }
      // Send the response message
      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error("Search failed:", error);
      await interaction.reply("Failed to search due to an error.");
    }
  }
};
