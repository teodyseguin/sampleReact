import dispatcher from '../dispatcher';

export function expand(expanded) {
	dispatcher.dispatch({
		type: 'EXPANDED',
		expanded
	});
}

