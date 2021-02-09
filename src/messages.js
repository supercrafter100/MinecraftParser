const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {

	joinEmbed() {
		return `Client joined ${config.login.host}`;
	},

	sayEmbed(msg) {
		return `Said ${msg}`;
	},

	waitedEmbed(time) {
		return `Waited ${time} milliseconds`;
	},

	loopEmbed(lines) {
		return `Looping ${lines} lines`;
	},

	stopEmbed() {
		return `Client left ${config.login.host}`;
	},

	errorEmbed() {
		return "A syntax error was detected and the bot was stopped";
	}
}