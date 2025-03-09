const os = require('os');


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

module.exports = {
	getUsername,
	getHostname,
	getAddress,
	isAtty,
}