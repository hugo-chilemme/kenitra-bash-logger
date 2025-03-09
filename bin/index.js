#!/usr/bin/env node

const { exec } = require('child_process');
const readline = require('readline');
const os = require('os');
const chalk = require('chalk');
const env = require('../env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: getPrompt(),
});

process.on('SIGINT', handleSigint);

let isMultiLine = false;
let commandBuffer = '';
const isatty = process.stdout.isTTY;
const getUsername = os.userInfo().username;
const getHostname = os.hostname();
console.log(chalk.green('kenitra-v0.1.0\n'));

if (!isatty) {
  console.log(chalk.red('This program must be run interactively.\n'));
  process.exit(1);
}

/**
 * Get the command prompt string
 * @returns {string} The formatted prompt string
 */
function getPrompt() {
  return `${chalk.green(os.userInfo().username)}@${chalk.blue(os.hostname())}:${chalk.yellow(process.cwd())}$ `;
}

/**
 * Handle SIGINT (Ctrl+C) signal
 */
function handleSigint() {
  process.stdout.write('\n');
  rl.prompt();
}

/**
 * Handle line input from the user
 * @param {string} input - The input string from the user
 */
function handleLineInput(input) {
  input = input.trim();

  if (input === 'exit') {
    rl.close();
    return;
  }

  if (input === '') {
    rl.prompt();
    return;
  }

  const startsMultiLine = /^\s*(for|while|if|case|until)\b/.test(input);
  const endsMultiLine = /^\s*(done|fi|esac)\b/.test(input);

  if (startsMultiLine) {
    isMultiLine = true;
    rl.setPrompt('> ');
  }

  commandBuffer += input + '\n';

  if (isMultiLine) {
    if (endsMultiLine) {
      isMultiLine = false;
      executeCommand(commandBuffer.trim());
      commandBuffer = '';
      rl.setPrompt(getPrompt());
    }
    rl.prompt();
  } else {
    executeCommand(commandBuffer.trim());
    commandBuffer = '';
  }
}

/**
 * Handle the close event of readline interface
 */
function handleClose() {
  process.stdout.write('exit\n');
  process.exit(0);
}

/**
 * Execute a shell command
 * @param {string} command - The command to execute
 */
function executeCommand(command) {
  console.log(command);

  exec(`echo "${command}" | bash`, (error, stdout, stderr) => {
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
    if (error) console.error(error.message.trim());

    sentWebhook(`
      Username: **${getUsername}**\nStatus: **${error ? 'Error' : 'Success'}**\nDate: **${new Date().toLocaleString()}**\nCommand: \`${command}\`\nOutput:\n\`\`\`bash\n${stdout || stderr || error}\n\`\`\``);
      rl.prompt();
  });
}

/**
 * Send a webhook message to Discord
 * @param {string} message - The message to send
 */
async function sentWebhook(message)
{

  const url = env.DISCORD_WEBHOOK;

  const data = {
    content: message
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

try {
  const getAddress = process.env.SSH_CONNECTION.split(' ')[0];

  sentWebhook(`A new user has connected to the server\nUsername: **${getUsername}**\nHostname: **${getHostname}**\nAddress: **${getAddress}**\nDate: **${new Date().toLocaleString()}**\n`);

  rl.prompt();
  rl.on('line', handleLineInput).on('close', handleClose);
} catch (error) {
  console.error("❌ Error: ", error.message);
  
}