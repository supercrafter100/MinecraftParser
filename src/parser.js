const minecraft = require('./minecraft');
const messages = require('./messages');
const logger = require('./loggerMessage');

let variables = {};
let loopedCode = [];
let inLoop = false;

module.exports = async (rawcode, channel) => {

	const msg = await channel.send('Bot runtime');
	const loggerFactory = new logger(msg);

	const code = await prepareCode(rawcode);
	
	await loggerFactory.editMessage("Code parsed");
	
	await minecraft.startClient();
	loggerFactory.editMessage(messages.joinEmbed());

	const invididualControls = code.split('\n');
	let currentIndex = 0;
	for (const control of invididualControls) {
		currentIndex++;

		if (control.length < 1) continue;

		const args = control.split(' ')
		const ctrl = args.shift();
		if (ctrl == "loop") {

			if (!args[1] || parseInt(args[0]) == null) {
				loggerFactory.editMessage(messages.errorEmbed())
				await minecraft.stopClient();
				return;
			}

			let loopAmount = parseInt(args[0]);

			let savingLoopContent = true;
			inLoop = true;
			for (let i = currentIndex + 1; i < invididualControls.length; i++) {
				let component = invididualControls[i];
				if (component == "}" && savingLoopContent == true) {
					savingLoopContent = false;
				}  else if (savingLoopContent == true && component.length > 0) {
					loopedCode.push(component)
				}
			}
			loggerFactory.editMessage(messages.loopEmbed(loopedCode.length))
			await runLoopCode(loopAmount, loopedCode, loggerFactory);
			loopedCode = [];
			loopAmount = null;
			
		} else if (ctrl == "}") {
			if (inLoop == true) {
				inLoop = false;
			}
		} else {
			if (inLoop == false) {
				await handleLine(control, loggerFactory);
			}
		}
			
	}

	await minecraft.stopClient();
	await loggerFactory.editMessage(messages.stopEmbed());
}

function runLoopCode(amount, loopcode, loggerFactory) {
	return new Promise(async (resolve) => {
		let currentLoop = 0;
		while (currentLoop < amount) {
			currentLoop++
			for (const line of loopcode) {
				await handleLine(line, loggerFactory, currentLoop);
			}
		}

		resolve();
	})
}

function handleLine(line, loggerFactory, loop_number = "<none>") {
	return new Promise(async (resolve) => {
		if (line.length < 1) resolve();
	
		const args = line.split(' ')
		const ctrl = args.shift();
		if (ctrl == "say")
			{
				let msg = args.join(' ').replace(/\[loop_number\]/g, loop_number)
				await minecraft.sayMessage(msg)
				await loggerFactory.editMessage(messages.sayEmbed(msg))
			}
			
		else if (ctrl == "wait")
			{
				await sleep(args[0]);
				await loggerFactory.editMessage(messages.waitedEmbed(args[0]))
			}
		
		resolve();
	})
}


function prepareCode(code) {
	return new Promise((resolve) => {
		
		// Change all { } so they are on seperate lines
		code = code.toLowerCase();
		
		code = code.replace(/{/g, "\n{\n");
		code = code.replace(/}/g, "\n}\n");

		code.trim();

		resolve(code);
	})
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}