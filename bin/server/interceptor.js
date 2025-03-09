const logWebhook = require('./lib/webhook');


const args = process.argv.slice(2);

let data;



try {
	data = JSON.parse(args[0]);
} catch (e) {
	throw new Error('Invalid JSON');
}

const { type, hostname, username, address } = data;


if (type === 'connect') 
	logWebhook.connect(username, hostname, address);
if (type === 'command') 
	logWebhook.command(username, data.command, data.error, data.stdout, data.stderr);