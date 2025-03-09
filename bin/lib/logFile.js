const fs = require('fs');
const { getUsername, getHostname, getAddress } = require('./utils');
const env = require('../../settings');

function logFile(data) {

	if (!env.logFile)
	{
		return;
	}

	fs.appendFile('/var/log/kenitra.log', data + '\n', (err) => {
		if (err) return;
	});
}

function connect()
{
	const message = `[${new Date().toLocaleString()}] ${getUsername()} connected to ${getHostname()} from ${getAddress()}`;
	logFile(message);
}

function command(command, error, stdout, stderr) {

	let message = `[${new Date().toLocaleString()}] ${getUsername()} ran command: ${command}success: ${!error}`;
	logFile(message);
}


module.exports = { connect, command };