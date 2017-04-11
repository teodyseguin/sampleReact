import { EventEmitter } from 'events';
import dispatcher from '../dispatcher'; 

class CFActionsStore extends EventEmitter {
	constructor() {
		super();
		this.editMode = false;
	}

	actionsHandler(action) {
		switch(action.type) {
			case 'EDIT_MODE':
				this.editMode = action.status
				this.emit('change');
				break;
		}
	}
}

const cfActionsStore = new CFActionsStore();
dispatcher.register(cfActionsStore.actionsHandler.bind(cfActionsStore));

export default cfActionsStore;

