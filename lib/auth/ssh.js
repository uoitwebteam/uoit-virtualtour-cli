const keygen	 = require('ssh-keygen');
const Rsync 	 = require('rsync');

const utils = require('../utils');
const prompts = require('../prompts');
const {
	PREFERENCES,
	DEVELOPER_EMAIL,
	SSH_KEY_PATH
} = require('../constants');

module.exports = () => prompts.auth.ssh()
  .then(({ connection, user, hostname, location, remember }) => {
  	if (remember) {
  		PREFERENCES.sshConnections.push({ user, hostname, location })
  	}
  	if (connection) {
			syncFilesWithRsync(connection);
  		callback(null, connection)
  	} else {
			syncFilesWithRsync({ user, hostname, location });
		}
  });

function syncFilesWithRsync({ user, hostname, location }) {
	// Build the command
	var rsync = new Rsync()
	  .shell('ssh')
	  .flags('avz')
	  .source('.')
	  .destination(utils.getConnectionString(user, hostname, location))
	  .dry();

	rsync.cwd(PREFERENCES.serverPath)
	// Execute the command
	rsync.execute(function(error, code, cmd) {
		utils.logSuccess('rsync done –', code, cmd);
	});

	rsync.output(function(data){
		utils.logSuccess('rsync –', data);
  }, function(data) {
		utils.logError('rsync err –', data);
  });
}

function generateKeypair(password) {
	return new Promise((resolve, reject) => {
		const location = SSH_KEY_PATH;
		const comment = DEVELOPER_EMAIL;

		keygen({
		  location,
		  comment,
			password,
		  read: true
		}, function(err, out){
			if(err) reject(err);
			utils.logSuccess('Keys created!');
			utils.logSuccess('private key: '+out.key);
			utils.logSuccess('public key: '+out.pubKey);
		});
		
	});
}