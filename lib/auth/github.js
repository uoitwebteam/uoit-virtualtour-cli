const inquirer = require('inquirer');
const chalk 	 = require('chalk');
const Spinner  = require('clui').Spinner;
const GithubApi   = require('github');
const github = new GithubApi(/* { debug: true } */);

const prompts = require('../prompts');
const { PREFERENCES } = require('../constants');

module.exports = function() {
	return githubAuth()
		.then(token => {
		  if (token) {
		    utils.logSuccess('Sucessfully authenticated to a Virtual Tour repository!');
		  }
		})
		.catch(err => {
	    switch (err.code) {
	      case 401:
	        utils.logError('Couldn\'t authenticate to a repository. Please try again.');
	        break;
	      case 403:
	        utils.logError('Couldn\'t authenticate to this repository with the stored access token.');
	        break;
	      case 422:
	        utils.logError('You already have an access token.');
	        break;
	    }
		});
}

function githubAuth() {
	return getGithubToken()
  	.then(token => {
	    github.authenticate({
	      type : 'oauth',
	      token : token
	    });
	    return token;
	  });
}

function getGithubToken() {
	return new Promise((resolve, reject) => {
	  if (PREFERENCES.github && PREFERENCES.github.token) {
	    return resolve(PREFERENCES.github.token);
	  }

	  inquirer.prompt(prompts.auth.github).then(credentials => {
	    const status = new Spinner('Authenticating you, please wait...');
	    status.start();

	    const authRequest = Object.assign({}, { type: 'basic' }, credentials);
	    github.authenticate(authRequest);

	    github.authorization.create({
	      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
	      note: 'uoit-virtualtour-cli, the UOIT Virtual Tour command-line interface'
	    }, function(err, res) {
	      status.stop();
	      if (err) reject(err);
	      const token = res.token || res.data.token;
	      if (token) {
	        PREFERENCES.github = {
	          token: token
	        };
	        resolve(token);
	      } else {
        	reject('No github access token returned');
	      }
	    });
	  });
	});
}