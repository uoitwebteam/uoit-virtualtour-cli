#!/usr/bin/env node --harmony
'use strict';
const program			 = require('commander');

const utils 			 = require('./lib/utils');
const githubAuth 	 = require('./lib/auth/github');
const sshAuth 	 	 = require('./lib/auth/ssh');
const commands 		 = require('./lib/commands');

/* Delete Github token: */
// PREFERENCES.github = {}

const { version } = require('./package.json');
const lastOpen = new Date();

program
  .version('0.0.1')
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
				.then(result => console.log('Install done! called:', result))
				.catch(err => console.log('An error has occured! ', err));
		});

	program
		.command('deploy')
		.description('push a production copy to the server')
		.action(env => {
			commands.deploy()
				.then(result => console.log('Deploy done! called:', result))
				.catch(err => console.log('An error has occured! ', err));
		});

	program.parse(process.argv);

	if (!program.args.length) {
		utils.renderLogo();
		commands.menu()
			.then(result => console.log('Done! called:', result))
			.catch(err => console.log('An error has occured!', err));
	}
});