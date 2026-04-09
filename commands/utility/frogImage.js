const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frog')
		.setDescription('Get a random frog'),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const res = await fetch('https://allaboutfrogs.org/funstuff/randomfrog.html');
			const body = await res.text();

			const matches = [...body.matchAll(/"http:\/\/www\.allaboutfrogs\.org\/funstuff\/random\/\d+\.jpg"/g)];

			if (!matches.length) {
				throw new Error('No frog images found');
			}

			const images = matches.map(m => m[0].replace(/"/g, ''));
			const frogUrl = images[Math.floor(Math.random() * images.length)];

			await interaction.editReply({
				content: frogUrl,
			});

		} catch (err) {
			console.error(err);
			await interaction.editReply('oopsie whoopsie');
		}
	},
};