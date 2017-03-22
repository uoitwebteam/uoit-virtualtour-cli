const fs 	  = require('fs');
const path  = require('path');
const clear = require('clear');
const chalk = require('chalk');
const Line  = require('clui').Line;

const {
	PREFERENCES,
	LOGO_TOP,
	LOGO_BOTTOM,
	HORIZONTAL_RULE
} = require('./constants');

exports.getCurrentDirectoryBase = () => path.basename(process.cwd());

exports.getConnectionString = ({ username, host, location }) => `${ username }@${ host }${ location ? ':' + location : '' }`;

exports.getBasicValidator = field => answer => (!!answer.length || `Please enter a valid ${ field }!`);

exports.fileExists = filePath => {
  try {
		return fs.existsSync(filePath)
  } catch (err) {
    return false;
  }
};

exports.directoryExists = directoryPath => {
  try {
    return fs.statSync(directoryPath).isDirectory();
  } catch (err) {
    return false;
  }
}

exports.recordPreferences = prefs => {
	Object.assign(PREFERENCES, prefs);
}

exports.renderLogo = () => {
	clear();

	console.log(chalk.bold.dim.white(`${ HORIZONTAL_RULE }\n`));
	console.log(chalk.bold.cyan(LOGO_TOP));
	console.log(chalk.bold.white(LOGO_BOTTOM));
	console.log(chalk.bold.dim.white(`\n${ HORIZONTAL_RULE }`));
	 
	const headers = new Line()
	  .column(`© ${ PREFERENCES.lastOpen.getFullYear() } University of Ontario Institute of Technology`, 52, [chalk.bold.white])
	  .fill()
	  .column(`Version ${ PREFERENCES.version }`, 48, [chalk.dim.white])
	  .column('BETA', 4, [chalk.dim.cyan])
	  .fill()
	  .output();

	console.log(chalk.bold.dim.white(`${ HORIZONTAL_RULE }\n`));
}

const colorLog = chalk => (message, ...args) => console.log(chalk(message), ...args);
exports.logSuccess = colorLog(chalk.green);
exports.logError = colorLog(chalk.red);
exports.logNote = colorLog(chalk.dim.white);
exports.logHeading = colorLog(chalk.cyan);
exports.logInfo = colorLog(chalk.dim.cyan);