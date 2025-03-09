const env = require('../../settings');
const { getUsername, getHostname, getAddress } = require('./utils');

async function sentWebhook(message) {
	const DISCORD_WEBHOOK = env.DISCORD_WEBHOOK;
	
	if(!DISCORD_WEBHOOK || !DISCORD_WEBHOOK.startsWith('http')) {
		return;
	}

	const data = {
	  content: message,
	};
  
	try {
	  const response = await fetch(DISCORD_WEBHOOK, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	  });
  
	  if (!response.ok) {
		throw new Error(`Failed to send webhook: ${response.statusText}`);
	  }
	} catch (error) {
	  console.error(`❌ Error sending webhook: ${error.message}`);
	}
}


function connect()
{
	const message = `🔔 **${getUsername()}** connected to **${getHostname()}** from **${getAddress()}**`;

	sentWebhook(message);
}

function command(command, error, stdout, stderr) {

	let message = `📝 **${getUsername()}** ran command: \`${command}\`\n\n`;

	if (error) {
		message += '❌ **Error:**\n```sh\n' + error + '```';
	} else {
		message += '✅ **Output:**\n```sh\n' + stdout + '```';
	}

	sentWebhook(message);

}

module.exports = { connect, command };