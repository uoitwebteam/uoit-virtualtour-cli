const chalk = require('chalk');

const utils = require('./utils');
const {
	PREFERENCES,
	HOME_DIRECTORY,
	SSH_KEY_PATH
} = require('./constants');

const choices = [
	`${PREFERENCES.installed ? 'Rei': 'I' }nstall`,
	'Develop',
	'Test',
	'Build',
	'Deploy',
	'Monitor'
];

exports.menu = [{
  type: 'list',
  name: 'command',
  message: 'What would you like to do?',
  default: PREFERENCES.installed ? 'Develop' : 'Install',
  choices
}];

exports.install = [{
  type: 'list',
  name: 'currentPath',
  message: `Where would you like to install the Virtual Tour instance?`,
  choices: [{
  	name: `Current directory ${chalk.reset.dim.white(`(${ process.cwd() })`)}`,
  	value: process.cwd()
  }, {
  	name: `Home folder ${chalk.reset.dim.white(`(${ HOME_DIRECTORY })`)}`,
  	value: HOME_DIRECTORY
  }, {
  	name: 'Other',
  	value: false
  }],
  default: process.cwd()
}, {
	type: 'input',
	name: 'basePath',
	message: 'Provide a directory path:',
	when(answers) {
		return !answers.currentPath;
	},
  validate(input) {
  	const inputDir = input.trim();
  	return (input.length && utils.directoryExists(inputDir)) || 'The install location supplied is invalid! Please ensure you are specifying a full path to a folder on your filesystem.';
  },
  filter(input) {
  	return input.trim();
  }
}];

exports.auth = {
	github: [{
    name: 'username',
    type: 'input',
    message: 'Enter a Virtual Tour repository username or e-mail address:',
    validate: utils.getBasicValidator('username or e-mail address')
  }, {
    name: 'password',
    type: 'password',
    message: 'Enter the repository\'s password:',
    validate: utils.getBasicValidator('password')
  }],
  ssh: [{
    name: 'connection',
    type: 'list',
    message: 'Which credentials would you like to connect with?',
    choices: [...PREFERENCES.sshConnections.map(connection => ({
    	name: `${ connection.user }@${ connection.hostname }${ chalk.dim(':'+connection.location)}`,
    	value: connection
    })), {
    	name: 'Other',
    	value: false
    }],
    when() {
    	return PREFERENCES.sshConnections && PREFERENCES.sshConnections.length;
    }
  }, {
    name: 'user',
    type: 'input',
    message: `Enter a username to connect with:`,
    validate: utils.getBasicValidator('username'),
    when(answers) {
    	return !PREFERENCES.sshConnections || !PREFERENCES.sshConnections.length || !answers.connection;
    }
  }, {
    name: 'hostname',
    type: 'input',
    message: `Enter the connection hostname: ${ chalk.dim.white('(example.host.com') })`,
    validate: utils.getBasicValidator('host connection'),
    when(answers) {
    	return !PREFERENCES.sshConnections || !PREFERENCES.sshConnections.length || !answers.connection;
    }
  }, {
    name: 'location',
    type: 'input',
    message: `Enter the location for this deployment:`,
    validate: utils.getBasicValidator('location'),
    when(answers) {
    	return !PREFERENCES.sshConnections || !PREFERENCES.sshConnections.length || !answers.connection;
    }
  }, {
    name: 'remember',
    type: 'confirm',
    message: 'Would you like to remember these settings for future use?',
    when(answers) {
    	return !PREFERENCES.sshConnections || !PREFERENCES.sshConnections.length || !answers.connection;
    }
  }, {
    name: 'storekey',
    type: 'confirm',
    message: 'You appear to have a public SSH key already; would you like to store it with the remote host for future use?',
    when(answers) {
    	return utils.fileExists(SSH_KEY_PATH)
    }
  }]
};