import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class SettingsStore extends EventEmitter {
	constructor() {
		super();
		this.account = null;
	}

	actionsHandler(action) {
		switch(action.type) {
			case 'GET_BILLINGS':
				this.getBillingInfo();
				this.emit('populated');
				break;
			case 'UPDATE_ACCOUNT':
				this.updateAccount(action.account);
				this.emit('account updated');
				break;
			case 'UPDATE_BILLINGINFO':
				this.updateBillingInfo(action.billingInfo);
				this.emit('billingInfo updated');
				break;
		}	
	}

	updateAccount(account) {
		this.account = account;	
	}

	updateBillingInfo(billingInfo) {
		if (!this.account.billingInfo) {
			this.account.billingInfo = [];	
		}

		this.account.billingInfo.push(billingInfo);
	}
} 

const settingsStore = new SettingsStore();
dispatcher.register(settingsStore.actionsHandler.bind(settingsStore));

export default settingsStore;

