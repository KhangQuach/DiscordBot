const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

//intends
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,          // Basic intent for guild related events
		GatewayIntentBits.GuildMembers,    // Privileged intent for receiving all member-related events
		GatewayIntentBits.GuildPresences,  // Privileged intent for receiving presence updates
		GatewayIntentBits.GuildMessages,   // Intent for receiving messages in guilds
		GatewayIntentBits.DirectMessages,  // Intent for receiving direct messages
		GatewayIntentBits.MessageContent,   // Privileged intent for receiving all content of messages
		GatewayIntentBits.GuildVoiceStates
	]
});

client.commands = new Collection();
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'src/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Handle interaction 
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});
// Once the client is ready, log the bot's tag to the console
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});




client.login(token);