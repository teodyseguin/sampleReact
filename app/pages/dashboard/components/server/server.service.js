import React from 'react';

export let ServerService = (function() {
	'use strict';

	class ServerServiceClass {
		/**
		 * Get the list of Server objects per particular account
		 *
		 * @param Parse
		 *  It is the Parse object obtain by importing/requiring it
		 *  e.g. import Parse from 'parse' OR var Parse = require('parse')
		 * @param ownerPointer
		 * 	Generally, it is the Parse.User.current() object map, which is
		 * 	stored from an Account object e.g. Account.onwerPointer.
		 * @param callback
		 *  An anonymous function which will carry back the returned results
		 */
		static getServers(Parse, ownerPointer, callback) {
			let Server = Parse.Object.extend('Server');
			let query = new Parse.Query(Server);

			query.equalTo('accountPointer', ownerPointer);
			query.find({
				success(results) {
					return callback(null, results);
				},
				error(error) {
					return callback(error);
				}
			});
		}

		/**
		 * Create's a Server object
		 *
		 * @param serverName
		 * 	The name of the server in string form
		 * @param Parse
		 * 	A Parse object. Say, when you require the Parse object via import/require
		 * 	e.g. import Parse from 'parse'. I am passing Parse cause I don't wan this
		 * 	utility to be dependent to anything
		 * @param activeAccount
		 * 	An object of type Account. It is the Account object, assigned to be 'active'
		 * 	from the time the dashboard page is first loaded
		 * @return
		 * 	A promise object of type Server. It is the created Server object.
		 * 	Throws and error message otherwise.
		 */
		static createServer(serverName, Parse, serverModel, activeAccount) {
			let self = this;

			serverModel.set('ACL', new Parse.ACL(Parse.User.current()));
			serverModel.set('accountPointer', activeAccount);
			serverModel.set('done', false);
			serverModel.set('serverName', serverName || 'Untitled Server');

			return serverModel.save(null, {
				success(serverModel) {
					return Promise.resolve(serverModel);
				},
				error(server, error) {
					throw new Error(error);
				}
			});
		}
	}

	return ServerServiceClass;
})();

