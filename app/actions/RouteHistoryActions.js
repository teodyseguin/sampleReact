import dispatcher from '../dispatcher';

export function updateRoute(route) {
	dispatcher.dispatch({
		type: 'UPDATE_ROUTE',
		route
	});
}

