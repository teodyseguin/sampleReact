import dispatcher from '../dispatcher';

export function getBillingInfo() {
	dispatcher.dispatch({
		type: 'GET_BILLINGS' 
	});
}

export function updateAccount(account) {
	dispatcher.dispatch({
		type: 'UPDATE_ACCOUNT',
		account
	});
}

export function updateBillingInfo(billingInfo) {
	dispatcher.dispatch({
		type: 'UPDATE_BILLINGINFO',
		billingInfo
	});
}

