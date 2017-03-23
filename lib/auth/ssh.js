const keygen = require('ssh-keygen');
const execa	 = require('execa');

const utils = require('../utils');
const prompts = require('../prompts');
const {
	PREFERENCES,
	DEVELOPER_EMAIL,
	SSH_DIRECTORY,
	AUTHORIZED_KEYS,
	SSH_KEY_PATH,
	SSH_PUBKEY_PATH
} = require('../constants');

module.exports = answers => {
	const {
		connection,
		username,
		host,
		location,
		remember,
		storekey
	} = answers;

	const credentials = connection || { username, host, location };

	if (remember) {
		PREFERENCES.sshConnections.push(credentials)
	}

	if (storekey) {
		return storePublicKey(credentials)
			.then(() => {
				PREFERENCES.sshStoredKeys.push(credentials);
				utils.logSuccess('SSH key stored on remote host!');
				return credentials;
		  })
			.catch(err => utils.logError('Error storing SSH key on remote host!', err.stderr));
	} else {
  	return Promise.resolve(credentials);
  }
}

function generateKeypair() {
	return new Promise((resolve, reject) => {
		const location = SSH_KEY_PATH;
		const comment = DEVELOPER_EMAIL;

		keygen({
		  location,
		  comment,
		  read: true
		}, function(err, out){
			if(err) reject(err);
			utils.logSuccess('New SSH key generated!');
			utils.logHeading('Public key:');
			utils.logInfo(out.pubKey);
			resolve(out.pubKey);
		});
		
	});
}

function storePublicKey({ username, host, location }) {
	const connection = utils.getConnectionString({ username, host });
	const command = `cat ${ SSH_PUBKEY_PATH } | ssh -i ${ SSH_KEY_PATH } ${ connection } 'cat >> /home/${ username }/${ SSH_DIRECTORY }/${ AUTHORIZED_KEYS }'`;
	if (!utils.fileExists(SSH_KEY_PATH)) {
		return generateKeypair()
			.then(() => execa.shell(command));
	} else {
		return execa.shell(command);
	}
}