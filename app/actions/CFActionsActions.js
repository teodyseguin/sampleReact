import dispatcher from '../dispatcher';

export function editMode(status) {
	dispatcher.dispatch({
		type: 'EDIT_MODE',
		status
	});
}

