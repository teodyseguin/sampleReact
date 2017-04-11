import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class ImageUploadStore extends EventEmitter {
	constructor() {
		super();
		this.upload = null;
	}

	actionsHandler(action) {
		switch(action.type) {
			case 'UPDATE_UPLOAD':	
				this.upload = action.upload;
				this.emit('change');
				break;
		}
	}
}

const imageUploadStore = new ImageUploadStore();
dispatcher.register(imageUploadStore.actionsHandler.bind(imageUploadStore));

export default imageUploadStore;

