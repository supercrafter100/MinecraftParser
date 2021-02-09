const mineflayer = require('mineflayer');
const config = require('../config.json');

let client;

module.exports = {

	async startClient() {
		return new Promise(async (resolve) => {
			// start client
			client = mineflayer.createBot(config.login);
			client.once('spawn', () => resolve());
		})
	},

	async stopClient() {
		return new Promise(async (resolve) => {
			await client.quit();
			client = null;
			resolve();
		})
	},

	async sayMessage(msg) {
		return new Promise(async (resolve) => {
			await client.chat(msg);
			resolve()
		})
	},

	async doMovement() {

	}

}