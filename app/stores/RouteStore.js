import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class RouteStore extends EventEmitter {
	constructor() {
		super();

		this.history = {
			previous: null,
			current: null
		};
	}

	actionsHandler(action) {
		switch(action.type) {
			case 'UPDATE_ROUTE':
				this.history.previous = action.route.previous;
				this.history.current = action.route.current;
				break;
		}
	}
}

const routeStore = new RouteStore();
dispatcher.register(routeStore.actionsHandler.bind(routeStore));

export default routeStore;

