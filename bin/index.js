#!/usr/bin/env node

const { exec } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
const env = require('../settings');

const { getUsername, getHostname, getAddress, isAtty } = require('./lib/utils');

let isMultiLine = false;
let commandBuffer = '';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: getPrompt(),
});

process.on('SIGINT', handleSigint);

console.log(chalk.green('kenitra-v0.1.0\n'));

if (!isAtty()) {
  console.log(chalk.red('This program must be run interactively.\n'));
  process.exit(1);
}

function getPrompt() {
  return env.prompt(getUsername(), getHostname(), process.cwd());
}

function handleSigint() {
  process.stdout.write('\n');
  rl.prompt();
}

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

function handleClose() {
  process.stdout.write('exit\n');
  process.exit(0);
}

function executeCommand(command) {
  console.log(command);

  exec(`echo "${command}" | bash`, (error, stdout, stderr) => {
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
    if (error) console.error(error.message.trim());

    sendWebhook(`
      Username: **${getUsername()}**\nStatus: **${error ? 'Error' : 'Success'}**\nDate: **${new Date().toLocaleString()}**\nCommand: \`${command}\`\nOutput:\n\`\`\`bash\n${stdout || stderr || error}\n\`\`\``);
    rl.prompt();
  });
}

async function sendWebhook(message) {
  const url = env.DISCORD_WEBHOOK;

  const data = {
    content: message,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send webhook: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`❌ Error sending webhook: ${error.message}`);
  }
}

try {

  sendWebhook(`A new user has connected to the server\nUsername: **${getUsername()}**\nHostname: **${getHostname()}**\nAddress: **${getAddress()}**\nDate: **${new Date().toLocaleString()}**\n`);

  rl.prompt();
  rl.on('line', handleLineInput).on('close', handleClose);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
}
