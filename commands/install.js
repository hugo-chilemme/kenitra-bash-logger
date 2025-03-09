const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const target = process.cwd() + '/bin/client/shell.js';

const scriptContent = `#!/bin/bash
if [ -t 0 ]; then

	exec "${target}" "$@"
else
	exec /bin/bash
fi`;

const scriptPath = '/bin/kenitra';

// Write the script to /bin/kenitra
fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

// Add /bin/kenitra to /etc/shells
execSync(`echo "${scriptPath}" | sudo tee -a /etc/shells`);

// Get all users with UID between 0 and 65000
const users = execSync("awk -F: '{ if ($3 >= 0 && $3 < 65000) print $1 }' /etc/passwd")
	.toString()
	.trim()
	.split('\n');


execSync(`touch /var/log/kenitra.log; chmod +w /var/log/kenitra.log`);
// Change the shell for each user
users.forEach(user => {
	console.log(`✅ Editing user shell : ${user}`);
	execSync(`sudo chsh -s ${scriptPath} ${user}`);
});

console.log("✅ Bash contrôlé installé avec succès. Déploiement terminé.");
