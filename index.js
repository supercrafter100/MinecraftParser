const Discord = require('discord.js');

// Get config
const config = require('./config.json');

// Create discord client 
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`${client.user.tag} is ready!`)
});

client.on('message', (message) => {
	if (message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) {
		// get our neccesary variable
		let args = message.content.slice(1).split(' ');
		const command = args.shift();

		if (command.toLowerCase() == "run") {
			
			const fullCode = args.join(' ');
			const split = fullCode.split('\`\`\`');

			if (!split[1]) return message.reply('You fucked up mate')
			const code = split[1].trim();

			require('./src/parser')(code, message.channel);
		}
	}
})

client.login(config.token);