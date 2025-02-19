const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const googleTTS = require('google-tts-api'); // Import Google TTS

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Reads the input message aloud in your current voice channel.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to be read aloud')
        .setRequired(true)),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({ content: "You need to be in a voice channel to use this command!", ephemeral: true });
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    // Use Google TTS to get an audio URL
    const url = googleTTS.getAudioUrl(message, {
      lang: 'vi',
      slow: false,
      host: 'https://translate.google.com',
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(url);
    player.play(resource);
    connection.subscribe(player);

    player.on('error', error => console.error(`Error: ${error.message}`));
    player.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
        // connection.destroy(); // Disconnect when finished playing
      }
    });

    await interaction.reply({ content: `Reading your message: "${message}" in ${voiceChannel.name}`, ephemeral: true });
  }
};