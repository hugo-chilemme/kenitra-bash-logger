const env = require('../../settings');

async function sentWebhook(message) {
	const url = env.DISCORD_WEBHOOK;
  
	const data = {
	  content: message,
	};
  
	try {
	  const response = await fetch(url, {
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

module.exports = { sentWebhook};