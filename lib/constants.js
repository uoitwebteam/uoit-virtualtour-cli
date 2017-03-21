const os 					= require('os');
const path 		 		= require('path');
const figlet      = require('figlet');
const Preferences = require('preferences');

const gitUrl = projectName => `https://github.com/wosevision/${ projectName }.git`

const PREFERENCES = new Preferences('com.uoit.virtualtour');
if (!PREFERENCES.sshConnections) { PREFERENCES.sshConnections = [] }
exports.PREFERENCES = PREFERENCES;

exports.DEVELOPER_EMAIL = 'webteam@uoit.ca';

exports.HOME_DIRECTORY = os.homedir();
exports.SSH_DIRECTORY = path.join(exports.HOME_DIRECTORY, '.ssh');
exports.SSH_KEY_IDENT = 'id_rsa';
exports.SSH_KEY_PATH = path.join(exports.SSH_DIRECTORY, exports.SSH_KEY_IDENT);
exports.SSH_PUBKEY_PATH = path.join(exports.SSH_DIRECTORY, exports.SSH_KEY_IDENT + '.pub');

exports.REPO_NAME_SERVER = 'virtualtour-ks';
exports.REPO_NAME_CLIENT = 'virtualtour';
exports.REPO_NAME_MAP = 'uoit-campus-map';

exports.GITURL_SERVER = gitUrl(`${ exports.REPO_NAME_CLIENT }-cms`);
exports.GITURL_CLIENT = gitUrl(exports.REPO_NAME_CLIENT);
exports.GITURL_MAP = gitUrl(exports.REPO_NAME_MAP);

exports.LOGO_TOP = figlet.textSync('UOIT', { font: 'Isometric3', horizontalLayout: 'full' });
exports.LOGO_BOTTOM = figlet.textSync('Virtual Tour', { font: 'Cybersmall' });
exports.HORIZONTAL_RULE = '-----------------------------------------------------';