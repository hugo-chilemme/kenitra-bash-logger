const c = require('chalk');
const env = require('../../settings');

console.log(c.green('kenitra-v0.1.0\n'));

if (env.motd && env.motd.length > 0)
{
	console.log('');
	for (const line of env.motd)
	{
		console.log(line);
	}
}