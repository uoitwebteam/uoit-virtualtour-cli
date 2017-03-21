const inquirer    = require('inquirer');

const prompts = require('./prompts');
const installTasks = require('./tasks/install');
const sshAuth 	 = require('./auth/ssh');

module.exports = {
	menu(callback) {
		inquirer.prompt(prompts.menu).then(({ command }) => {
	  	switch (command) {
	  		case 'Install':
	  		case 'Reinstall':
	  			this.install(callback);
	  			break;
	  		case 'Build':
	  			callback(null, command);
	  			break;
	  		case 'Test':
	  			callback(null, command);
	  			break;
	  		case 'Deploy':
	  			callback(null, command);
	  			break;
	  		case 'Monitor':
	  			callback(null, command);
	  			break;
	  	}
	  });
	},
	install(callback) {
		inquirer.prompt(prompts.install)
			.then(answers => installTasks.run({
				basePath: answers.currentPath || answers.basePath
			}))
			.then(results => {
				callback(null, results);
			});
	},
	deploy(callback) {
		sshAuth(callback);
	}
}