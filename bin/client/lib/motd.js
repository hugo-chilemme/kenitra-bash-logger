const c = require('chalk');
const env = require('../../../settings');
const { getUsername, getHostname } = require('./utils');


console.log(c.green('kenitra-v0.1.0\n'));

if (env.motd && env.motd.length > 0)
{
	console.log('');
	for (let line of env.motd)
	{

		line = line.replace('%username%', getUsername());
		line = line.replace('%hostname%', getHostname());
		line = line.replace('%date%', new Date().toLocaleDateString());
		line = line.replace('%time%', new Date().toLocaleTimeString());

		console.log(line);
	}
}