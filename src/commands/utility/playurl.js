const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const play = require('play-dl');
// play.authorization()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playurl')
    .setDescription('Plays a YouTube video in your voice channel.')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('The YouTube URL to play')
        .setRequired(true)),

  async execute(interaction) {
    const url = interaction.options.getString('url');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    try {
      const stream = await play.stream(url);
      const player = createAudioPlayer();
      const resource = createAudioResource(stream.stream, { inputType: stream.type });
      player.play(resource);
      connection.subscribe(player);

      await interaction.reply(`Now playing: ${url}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to play the video. Please make sure the URL is correct and accessible.');
    }
  }
};