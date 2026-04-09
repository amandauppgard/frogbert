const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');

for (const folder of fs.readdirSync(foldersPath)) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(path.join(commandsPath, file));
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log('Deploying commands...');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Commands deployed!');
	} catch (error) {
		console.error(error);
	}
})();