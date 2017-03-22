const chalk 	 		= require('chalk');
const { prompt }  = require('inquirer');

const utils = require('./utils');
const {
	PREFERENCES,
	HOME_DIRECTORY,
	SSH_KEY_PATH
} = require('./constants');

const choices = [{
	name: `${PREFERENCES.installed ? 'Rei': 'I' }nstall`,
	value: 'install'
},{
	name: 'Develop',
	value: 'dev'
},{
	name: 'Test',
	value: 'test'
},{
	name: 'Build',
	value: 'build'
},{
	name: 'Deploy',
	value: 'deploy'
},{
	name: 'Monitor',
	value: 'monit'
}];

exports.menu = () => prompt([{
  type: 'list',
  name: 'command',
  message: 'What would you like to do?',
  default: PREFERENCES.installed ? 'dev' : 'install',
  choices
}]);

exports.install = () => prompt([{
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
}]);

exports.auth = {
	github: () => prompt([{
    name: 'username',
    type: 'input',
    message: 'Enter a Virtual Tour repository username or e-mail address:',
    validate: utils.getBasicValidator('username or e-mail address')
  }, {
    name: 'password',
    type: 'password',
    message: 'Enter the repository\'s password:',
    validate: utils.getBasicValidator('password')
  }]),

  ssh: () => prompt([{
    name: 'connection',
    type: 'list',
    message: 'Which credentials would you like to connect with?',
    choices: [...PREFERENCES.sshConnections.map(connection => ({
    	name: `${ connection.username }@${ connection.host }${ chalk.dim(':'+connection.location)}`,
    	value: connection
    })), {
    	name: 'Other',
    	value: false
    }],
    when() {
    	return PREFERENCES.sshConnections && PREFERENCES.sshConnections.length;
    }
  }, {
    name: 'username',
    type: 'input',
    message: `Enter a username to connect with:`,
    validate: utils.getBasicValidator('username'),
    when(answers) {
    	return !answers.connection;
    }
  }, {
    name: 'host',
    type: 'input',
    message: `Enter the connection host name: ${ chalk.dim.white('(example.host.com') })`,
    validate: utils.getBasicValidator('host name'),
    when(answers) {
    	return !answers.connection;
    }
  }, {
    name: 'location',
    type: 'input',
    message: `Enter the location for this deployment:`,
    validate: utils.getBasicValidator('location'),
    when(answers) {
    	return !answers.connection;
    }
  }, {
    name: 'remember',
    type: 'confirm',
    message: 'Would you like to remember these settings for future use?',
    when(answers) {
    	return !answers.connection;
    }
  }, {
    name: 'storekey',
    type: 'confirm',
    message: 'Would you like to store an SSH key with the remote host for future use?',
    when(answers) {
    	const { username, host } = answers.connection || answers;
    	return !PREFERENCES.sshStoredKeys.reduce((isStored, connection) => {
    		return (username === connection.username && host === connection.host);
    	}, false);
    }
  }])
};