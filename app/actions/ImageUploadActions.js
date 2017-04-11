import dispatcher from '../dispatcher';

export function updateUpload(upload) {
	dispatcher.dispatch({
		type: 'UPDATE_UPLOAD',
		upload
	});
}

