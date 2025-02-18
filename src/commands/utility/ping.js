const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies'),
	async execute(interaction) {
      await interaction.reply('Ping cái chó gì mà ping?');
	},
};