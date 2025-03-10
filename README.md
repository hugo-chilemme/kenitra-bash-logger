# Bash Controller Script 🚀

This script allows you to log connections and commands typed in real-time. 📝

## Context 📚

You can track the commands executed by users on your server. However, generic usernames like `root` or shared accounts can pose a problem as you cannot identify the actual user.

## Instructions 📋

### Installation 💻

1. **Clone the Repository**:
	First, clone the repository to your local machine using the following command:
	```bash
	git clone https://github.com/hugo-chilemme/kenitra-bash-logger.git
	npm install
	```

2. **Install the Bash Controller**:
	Execute the following command to install the bash controller. This will provide all users with a new bash that functions exactly the same way as the original.
	```bash
	npm run install
	```

### Applying for Root User 🔑

3. **Apply the Script for Root User**:
	To apply this script for the root user, execute the following command:
	```bash
	npm run apply-for-root
	```

### Uninstallation ❌

4. **Revert to Normal State**:
	If you want to revert to the original state, execute the following command:
	```bash
	npm run uninstall
	```

 
 ### Example 📌

```bash
# Connection Log
A new user has connected to the server
Username: john-doe
Hostname: ilovecoding
Address: 192.168.1.1
Date: 3/9/2025, 3:31:50 AM
```

```bash
# Command Log
Username: john-doe
Status: Success
Date: 3/9/2025, 3:53:59 AM
Command: ls
Output:
README.md
index.js
package-lock.json
package.json
```