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
      task: (ctx, task) => del(PREFERENCES.serverPath)
	      .then(() => {
	      	PREFERENCES.serverPath = undefined;
	      	task.title = `${ chalk.dim.white(task.title) } Old server removed!`;
	      }),
      enabled: () => PREFERENCES.serverPath && utils.directoryExists(PREFERENCES.serverPath)
    },{
      title: 'Found old client; uninstalling...',
      task: (ctx, task) => del(PREFERENCES.clientPath)
	      .then(() => {
	      	PREFERENCES.clientPath = undefined;
	      	task.title = `${ chalk.dim.white(task.title) } Old client removed!`;
	      }),
      enabled: () => PREFERENCES.clientPath && utils.directoryExists(PREFERENCES.clientPath)
    },{
      title: 'Found old map; uninstalling...',
      task: (ctx, task) => del(PREFERENCES.mapPath)
	      .then(() => {
	      	PREFERENCES.mapPath = undefined;
	      	task.title = `${ chalk.dim.white(task.title) } Old map removed!`;
	      }),
      enabled: () => PREFERENCES.mapPath && utils.directoryExists(PREFERENCES.mapPath)
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
      		task: (c, task) => new Promise((resolve, reject) => {
      			git
					  	.cwd(PREFERENCES.basePath)
					  	.clone(GITURL_SERVER, PREFERENCES.serverPath, (err, result) => {
					  		if (err) reject(`Server clone error: ${err}`);
					  		resolve(result)
					  	})
					  	.then(() => {
					  		task.title = `${ chalk.dim.white(task.title) } Repository fetched!`
					  	});
				  })
    		}, {
      		title: 'Installing dependencies...',
      		task: (c, task) => execa.shell('npm install', { cwd: PREFERENCES.serverPath })
				  	.then(() => {
				  		task.title = `${ chalk.dim.white(task.title) } Dependencies installed!`
				  	})
      	}])

      }
    }, {
      title: 'Client installation',
      task: () => {

      	return new Listr([{
      		title: 'Fetching repository...',
      		task: (c, task) => new Promise((resolve, reject) => {
      			git
					  	.cwd(PREFERENCES.basePath)
					  	.clone(GITURL_CLIENT, PREFERENCES.clientPath, (err, result) => {
					  		if (err) reject(`Client clone error: ${err}`);
					  		resolve(result)
					  	})
					  	.then(() => {
					  		task.title = `${ chalk.dim.white(task.title) } Repository fetched!`
					  	});
				  })
    		}, {
      		title: 'Installing dependencies...',
      		task: (c, task) => execa.shell('npm install', { cwd: PREFERENCES.clientPath })
				  	.then(() => {
				  		task.title = `${ chalk.dim.white(task.title) } Dependencies installed!`
				  	})
      	}])

      }
    }, {
      title: 'Map installation',
      task: () => {

      	return new Listr([{
      		title: 'Fetching repository...',
      		task: (c, task) => new Promise((resolve, reject) => {
      			git
					  	.cwd(PREFERENCES.basePath)
					  	.clone(GITURL_MAP, PREFERENCES.mapPath, (err, result) => {
					  		if (err) reject(`Client clone error: ${err}`);
					  		resolve(result)
					  	})
					  	.then(() => {
					  		task.title = `${chalk.dim.white(task.title) } Repository fetched!`
					  	});
				  })
    		}, {
      		title: 'Installing dependencies...',
      		task: (c, task) => execa.shell('npm install', { cwd: PREFERENCES.mapPath })
				  	.then(() => {
				  		task.title = `${ chalk.dim.white(task.title) } Dependencies installed!`
				  	})
      	}])

      }
    }],{ concurrent: true });
  }
}, {
	title: 'Link modules',
	task: () => execa.shell(`npm link ${ PREFERENCES.mapPath }`, { cwd: PREFERENCES.clientPath })
		.then(() => {
			utils.recordPreferences({ installed: true });
		})
}]);