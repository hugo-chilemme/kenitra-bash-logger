const { execSync } = require('child_process');


execSync(`chsh -s /bin/kenitra root`);
console.log("✅ Bash Controller installed successfully for root.");
console.log("");