const { execSync } = require('child_process');
const fs = require('fs');

console.log("🔄 Restoring default shell for all users (including root), downloading...");

try {
	const passwdContent = fs.readFileSync('/etc/passwd', 'utf8');
	const users = passwdContent.split('\n').filter(line => {
		const fields = line.split(':');
		const uid = parseInt(fields[2], 10);
		return uid >= 0 && uid < 65000;
	}).map(line => line.split(':')[0]);

	users.forEach(user => {
		console.log(`✅ Restoring default shell for ${user}`);
		execSync(`chsh -s /bin/bash ${user}`);
	});

	fs.unlinkSync('/bin/kenitra');
	console.log("✅ Bash Controller uninstalled successfully.");
	console.log("");
	console.log("✅ Bash restored successfully for all users (including root).");
} catch (error) {
	console.error(`❌ Error: ${error.message}`);
}
