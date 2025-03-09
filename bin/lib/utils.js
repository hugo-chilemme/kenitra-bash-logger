const os = require('os');
const env = require('../../settings');

function getUsername() {
	return os.userInfo().username;
}

function getHostname() {
	return os.hostname();
}

function getAddress() {
	return process.env.SSH_CONNECTION?.split(' ')[0] || 'unknown';
}

function isAtty() {
	return process.stdout.isTTY;
}

function getPrompt() {
	return env.prompt(getUsername(), getHostname(), process.cwd());
  }

module.exports = {
	getUsername,
	getHostname,
	getAddress,
	isAtty,
	getPrompt,
}