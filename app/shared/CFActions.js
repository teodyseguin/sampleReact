import React from 'react';
import CFActionsStore from '../stores/CFActionsStore';
import * as CFActionsActions from '../actions/CFActionsActions';

function _fields(enabled, fields) {
	fields.forEach((key) => {
		document.getElementById(key).disabled = enabled;
	});
}

/**
 * Custom Form Actions
 *
 * This is a reusable component, specific to Panda Clouds
 * form creation. Common forms in Panda Clouds as of now
 * are having it's edit/save/cancel/back button on the
 * top section of the form.
 */
export default class CFActions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editMode: CFActionsStore.editMode
		};

		this.updateState = this.updateState.bind(this);
	}

	back() {
		this.props.router.goBack();
	}

	cancel() {
		_fields(true, this.props.fields);
		CFActionsActions.editMode(false);
	}

	componentDidMount() {
		CFActionsStore.on('change', this.updateState);
	}

	componentWillUnmount() {
		CFActionsStore.removeListener('change', this.updateState);
	}

	edit() {
		_fields(false, this.props.fields);
		CFActionsActions.editMode(true);
	}

	save() {
		this.props.save();
		_fields(true, this.props.fields);
		CFActionsActions.editMode(false);
	}

	render() {
		return(
			<ul className={this.props.classes}>
				<li 
					className="mode back" 
					onClick={(e) => this.back(e)}
					style={this.state.editMode ? {display: 'none'} : {display: 'block'}}
				>Back</li>

				<li 
					className="mode cancel" 
					onClick={(e) => this.cancel(e)}
					style={this.state.editMode ? {display: 'block'} : {display: 'none'}}
				>Cancel</li>

				<li 
					className="mode editing" 
					onClick={(e) => this.edit(e)}
					style={this.state.editMode ? {display: 'none'} : {display: 'block'}}
				>Edit</li>

				<li 
					className="mode saving" 
					onClick={(e) => this.save(e)}
					style={this.state.editMode ? {display: 'block'} : {display: 'none'}}
				>Save</li>
			</ul>			
		);
	}

	updateState() {
		this.setState({
			editMode: CFActionsStore.editMode
		});
	}
}

