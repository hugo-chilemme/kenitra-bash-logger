#!/usr/bin/env node

const { exec } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
const env = require('../settings');

require('./lib/motd');
const { getUsername, getHostname, getAddress, isAtty, getPrompt } = require('./lib/utils');
const logWebhook = require('./lib/webhook');

let isMultiLine = false;
let commandBuffer = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: getPrompt(),
});

process.on('SIGINT', handleSigint);

if (!isAtty()) {
  console.log(chalk.red('This program must be run interactively.\n'));
  process.exit(1);
}



function handleSigint() {
  process.stdout.write('\n');
  rl.prompt();
}

function handleLineInput(input) {
  input = input.trim();

  if (input === 'exit') {
    rl.close();
    console.log('Goodbye!');
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

    if (commandBuffer.trim().startsWith('cd ')) {
      const dir = commandBuffer.trim().substring(3).trim();
      try {
        process.chdir(dir);
        rl.setPrompt(getPrompt());
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
      }
      commandBuffer = '';
      rl.prompt();
      return
    }

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

    logWebhook.command(command, error, stdout, stderr);
      
    rl.prompt();
  });
}


try {

  logWebhook.connect();

  rl.prompt();
  rl.on('line', handleLineInput).on('close', handleClose);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
}
