import React from 'react';

export default class Spinner extends React.Component {
	constructor(props) {
		super(props);	
	}

	render() {
		return(
			<div className="spinner-wrapper">
				<div className="square-spinner uil-squares-css"><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
			</div>			
		);
	}
}
