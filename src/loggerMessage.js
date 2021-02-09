const { MessageEmbed } = require('discord.js');

module.exports =
class loggerMessage {


	constructor(message) {
		this.fullContent = "";
		this.message = message;
		this.currentMessage = 0;
		this.sendEmbed();
	}

	async editMessage(newMsg) {
		this.currentMessage++;
		this.fullContent += `\n${this.currentMessage}. ${newMsg}`;
		await this.sendEmbed();
	}

	async sendEmbed() {
		const embed = new MessageEmbed();
		embed.setColor('#dbf807');
		embed.setDescription(`\`\`\`\n${this.fullContent}\`\`\``)
		
		const msg = this.message;
		await msg.edit(embed);
	}
}