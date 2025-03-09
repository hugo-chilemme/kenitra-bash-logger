const c = require("chalk");

module.exports = {

	// Discord Webhook URL
	DISCORD_WEBHOOK: "",


	// Prompt for the terminal
	prompt: (username, hostname, cwd) => {

		// default prompt ssh
		// return `${username}@${hostname}:${cwd}$ `;

		return `${c.green(username)}@${c.blue(hostname)}:${c.yellow(cwd)}$ `;
	},


	// All log will be saved in a file /var/log/kenitra.log
	logFile: true, 
	

	// When the user connect to the server the message will be displayed
	motd: [
		'---------------------------------------------',
		' ',
		'Welcome %username% to kenitra-v0.1.0 on %hostname%',
		' %date% %time%',
		' ',
		'---------------------------------------------',
	]
}