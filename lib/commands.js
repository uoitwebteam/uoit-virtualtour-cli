const prompts = require('./prompts');
const utils = require('./utils');
const installTasks = require('./tasks/install');
const sshAuth 	 = require('./auth/ssh');

exports.install = () => prompts.install()
	.then(answers => {
		installTasks.run({
			basePath: answers.currentPath || answers.basePath
		});
	});

exports.deploy = () => sshAuth();

exports.menu = () => prompts.menu()
	.then( ({ command }) => exports[command.toLowerCase()]() )
	.catch(err => logError('Menu load error!', err));