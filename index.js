#!/usr/bin/env node --harmony
'use strict';
const program			 = require('commander');

const utils 			 = require('./lib/utils');
const githubAuth 	 = require('./lib/auth/github');
const commands 		 = require('./lib/commands');

// const { PREFERENCES } = require('./lib/constants');
/* Delete Github token: */
// PREFERENCES.github = {};
/* Reset saved SSH credentials: */
// PREFERENCES.sshConnections = [];
// PREFERENCES.sshStoredKeys = [];

const { version } = require('./package.json');
const lastOpen = new Date();

program
  .version('1.0.0')
  // .option('-C, --chdir <path>', 'change the working directory')
  // .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  // .option('-T, --no-tests', 'ignore test hook')

utils.recordPreferences({
	lastOpen,
	version
});

githubAuth().then(() => {
	program
		.command('install')
		.description('install the project locally')
		.action(env => {
			commands.install()
				.then(result => utils.logSuccess('Install done! called:', result))
				.catch(err => utils.logError('An error has occured! ', err));
		});

	program
		.command('deploy')
		.description('push a production copy to the server')
		.action(env => {
			commands.deploy()
				.then(result => utils.logSuccess('Deploy done! called:', result))
				.catch(err => utils.logError('An error has occured! ', err));
		});

	program.parse(process.argv);

	if (!program.args.length) {
		utils.renderLogo();
		commands.menu()
			.then(result => utils.logSuccess('Done! called:', result))
			.catch(err => utils.logError('An error has occured!', err));
	}
});