const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies'),
	async execute(interaction) {
			console.log(interaction);
      await interaction.reply('Ping cái chó gì mà ping?');
	},
};