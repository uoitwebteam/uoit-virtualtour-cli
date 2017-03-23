const Rsync = require('rsync');

const utils = require('../utils');
const {
	PREFERENCES,
	SSH_KEY_PATH
} = require('../constants');

module.exports = {
	run: target => syncFilesWithRsync(target)
}

function syncFilesWithRsync({ username, host, location }) {
	return new Promise((resolve, reject) => {
		// Build the command
		const rsync = new Rsync()
		  .shell(`ssh${ utils.fileExists(SSH_KEY_PATH) ? ' -i '+ SSH_KEY_PATH : '' }`)
		  .flags('avz')
		  .source('.')
		  .destination(utils.getConnectionString({ username, host, location }))
		  .dry();

		rsync.cwd(PREFERENCES.serverPath)
		// Execute the command
		rsync.execute((err, code, cmd) => {
			if (err) reject(err);
			utils.logInfo('rsync done –', code, cmd);
			resolve(cmd);
		});

		rsync.output(data => {
			utils.logInfo('rsync –', data);
	  }, err => {
			utils.logError('rsync err –', err);
	  });
	});
}