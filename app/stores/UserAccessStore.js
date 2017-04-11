import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class UserAcessStore extends EventEmitter {
	constructor() {
		super();
	}

	actionsHandler(action) {
		switch(action.type) {
		
		}	
	}
}

const userAccessStore = new UserAcessStore();
dispatcher.register(userAccessStore.actionsHandler.bind(userAccesStore));

export default userAccesStore;

