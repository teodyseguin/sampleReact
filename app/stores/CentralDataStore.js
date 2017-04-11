import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';
import _ from 'lodash';
import Parse from 'parse';
import { ServerService } from '../pages/dashboard/components/server/server.service';

let CentralDataStore = (function() {
	'use strict';

	let _data = [];

	class CentralDataStoreObject extends EventEmitter {
		constructor() {
			super();
		}

		actionsHandler(action) {
			switch(action.type) {
				case 'UPDATE_CENTRAL_DATA':
					_data = action.data;

					ServerService.getServers(
						Parse,
						_data.activeAccount,
						(error, results) => {
							if (error) {
								throw new Error(error);
							}

							_data.accountServers = results;

							this.emit('central_data_updated');
							console.log(`> Central data is updated from: ${action.from}`);
						}
					);

					break;

				case 'UPDATE_ACCOUNT_TO_DISPLAY':
					_data.accountToDisplay = action.accountToDisplay;

					this.emit('account_to_display_updated');
					break;

				case 'UPDATE_ACTIVE_ACCOUNT_ID':
					let activeAccount = _.filter(
						_data.accounts, {'id': action.accountID}
					);

					_data.activeAccountID = action.accountID;
					_data.accountToDisplay = activeAccount[0].toJSON().accountName;
					_data.activeAccount = activeAccount[0];

					ServerService.getServers(
						Parse,
						_data.activeAccount,
						(error, results) => {
							if (error) {
								throw new Error(error);
							}

							_data.accountServers = results;

							this.emit('active_account_id_updated');
						}
					);

					break;

				case 'UPDATE_ACCOUNT_SERVERS':
					_data
						.accountServers[action.data.modelIndex]
						.set(action.data.permission, action.data.hasUsers);

					this.emit('account_servers_updated');

					break;
			}
		}

		get data() {
			return _data;
		}
	}

	return CentralDataStoreObject;
})();

const centralDataStore = new CentralDataStore();
dispatcher.register(
	centralDataStore.actionsHandler.bind(centralDataStore)
);

export default centralDataStore;

