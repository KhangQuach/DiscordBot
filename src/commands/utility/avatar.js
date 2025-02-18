const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Replies with the avatar URL of a user.')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user to get the avatar of')
                  .setRequired(false)), // This makes the user option optional

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user; // Get the mentioned user or the user who executed the command
        const avatarUrl = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }); // Get avatar URL with maximum resolution and dynamic if it's a GIF

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatarUrl)  // Set the image to avatar
            .setColor('#0099ff');

        await interaction.reply({ embeds: [embed] });
    },
};