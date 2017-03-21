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
			commands.install((err, result) =>{
			  if (err) {
			    console.log('An error has occured');
			  }
			  console.log('Install done! called:', result);
			});
		});

	program
		.command('deploy')
		.description('push a production copy to the server')
		.action(env => {
			commands.deploy((err, result) =>{
			  if (err) {
			    console.log('An error has occured');
			  }
			  console.log('Deploy done! called:', result);
			});
		});

	program.parse(process.argv);

	if (!program.args.length) {
		utils.renderLogo();
		commands.menu((err, result) =>{
		  if (err) {
		    console.log('An error has occured');
		  }
		  console.log('Done! called:', result);
		});
	}
});