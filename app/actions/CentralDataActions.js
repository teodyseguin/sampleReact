import dispatcher from '../dispatcher';

export function updateCentralData(data, from) {
	dispatcher.dispatch({
		type: 'UPDATE_CENTRAL_DATA',
		from,
		data
	});
}

export function updateAccountToDisplay(accountToDisplay) {
	dispatcher.dispatch({
		type: 'UPDATE_ACCOUNT_TO_DISPLAY',
		accountToDisplay
	});
}

export function updateActiveAccountID(accountID) {
	dispatcher.dispatch({
		type: 'UPDATE_ACTIVE_ACCOUNT_ID',
		accountID
	});
}

export function updateAccountServers(data) {
	dispatcher.dispatch({
		type: 'UPDATE_ACCOUNT_SERVERS',
		data
	});
}

