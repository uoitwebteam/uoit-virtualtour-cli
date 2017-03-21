const path		 		= require('path');
const execa		 		= require('execa');
const del      		= require('del');
const chalk 			= require('chalk');
const git      		= require('simple-git')();
const Listr 	 		= require('listr');

const utils = require('../utils');
const {
	PREFERENCES,
	GITURL_SERVER,
	GITURL_CLIENT,
	GITURL_MAP,
	REPO_NAME_SERVER,
	REPO_NAME_CLIENT,
	REPO_NAME_MAP
} = require('../constants');

module.exports = new Listr([{
  title: 'Remove previous versions',
  task: () => {

  	return new Listr([{
      title: 'Found old server; uninstalling...',
      task: removeOld('server'),
      enabled: oldExists('server')
    },{
      title: 'Found old client; uninstalling...',
      task: removeOld('client'),
      enabled: oldExists('client')
    },{
      title: 'Found old map; uninstalling...',
      task: removeOld('map'),
      enabled: oldExists('map')
    }], { concurrent: true })

  },
  enabled: () => (PREFERENCES.serverPath || PREFERENCES.clientPath || PREFERENCES.mapPath)
},{
  title: 'Install packages',
  task: ctx => {

		const basePath = path.resolve(ctx.basePath);
		if (!utils.directoryExists(basePath)) return Promise.reject('Install path moved or deleted');
		utils.recordPreferences({
			serverPath: path.join(basePath, REPO_NAME_SERVER),
			clientPath: path.join(basePath, REPO_NAME_CLIENT),
			mapPath: path.join(basePath, REPO_NAME_MAP),
			basePath
		});

    return new Listr([{
      title: 'Server installation',
      task: () => {

      	return new Listr([{
      		title: 'Fetching repository...',
      		task: cloneRepo('server')
    		}, {
      		title: 'Installing dependencies...',
      		task: installDeps('server')
      	}])

      }
    }, {
      title: 'Client installation',
      task: () => {

      	return new Listr([{
      		title: 'Fetching repository...',
      		task: cloneRepo('client')
    		}, {
      		title: 'Installing dependencies...',
      		task: installDeps('client')
      	}])

      }
    }, {
      title: 'Map installation',
      task: () => {

      	return new Listr([{
      		title: 'Fetching repository...',
      		task: cloneRepo('map')
    		}, {
      		title: 'Installing dependencies...',
      		task: installDeps('map')
      	}])

      }
    }],{ concurrent: true });
  }
}, {
	title: 'Link modules',
	task: () => execa('npm', ['link', PREFERENCES.mapPath], { cwd: PREFERENCES.clientPath })
		.then(() => {
			utils.recordPreferences({ installed: true });
		})
}]);

function oldExists(which) {
	return () => PREFERENCES[`${ which }Path`] && utils.directoryExists(PREFERENCES[`${ which }Path`]);
}

function removeOld(which) {
	return (ctx, task) => del(PREFERENCES[`${ which }Path`])
    .then(() => {
    	PREFERENCES[`${ which }Path`] = undefined;
    	task.title = `${ chalk.dim.white(task.title) } Old ${ which } removed!`;
    });
}

function cloneRepo(which) {
	return (c, task) => new Promise((resolve, reject) => {
		git
	  	.cwd(PREFERENCES.basePath)
	  	.clone(GITURL_MAP, PREFERENCES[`${ which }Path`], (err, result) => {
	  		if (err) reject(`Error cloning ${ which }: ${err}`);
	  		resolve(result)
	  	})
	  	.then(() => {
	  		task.title = `${chalk.dim.white(task.title) } Repository fetched!`
	  	});
  });
}

function installDeps(which) {
	return (c, task) => execa('npm', ['install'], { cwd: PREFERENCES[`${ which }Path`] })
  	.then(() => {
  		task.title = `${ chalk.dim.white(task.title) } Dependencies installed!`
  	});
}