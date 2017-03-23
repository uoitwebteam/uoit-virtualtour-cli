const prompts = require('./prompts');
const utils = require('./utils');
const install = require('./tasks/install');
const deploy = require('./tasks/deploy');
const sshAuth 	 = require('./auth/ssh');

exports.install = () => prompts.install()
	.then(answers => install.run({ basePath: answers.currentPath || answers.basePath }));

exports.deploy = () => prompts.deploy()
	.then(credentials => sshAuth(credentials))
	.then(target => deploy.run(target))
	.then(result => utils.logSuccess(`SSH success! `, result))
	.catch(err => utils.logError('SSH error!', err));

exports.menu = () => prompts.menu()
	.then( ({ command }) => exports[command.toLowerCase()]())
	.catch(err => utils.logError('Menu load error!', err));