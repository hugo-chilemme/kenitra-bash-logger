const c = require("chalk");

module.exports = {
	DISCORD_WEBHOOK: "",
	prompt: (username, hostname, cwd) => {
		return `${c.green(username)}@${c.blue(hostname)}:${c.yellow(cwd)}$ `;
	},
	motd: [
		'---------------------------------------------',
		' ',
		'Welcome to kenitra-v0.1.0',
		' ',
		'---------------------------------------------',
	]
}