import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class HeaderStore extends EventEmitter {
	constructor() {
		super();
		this.expanded = false;
	}

	actionsHandler(action) {
		switch(action.type) {
			case 'EXPANDED':
				this.expanded = action.expanded;
				this.emit('change');
				break;
		}
	}
}

const headerStore = new HeaderStore();
dispatcher.register(
	headerStore.actionsHandler.bind(headerStore)
);

export default headerStore;

