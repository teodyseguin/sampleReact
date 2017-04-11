import React from 'react';
import Parse from 'parse';
import _ from 'lodash';
import { Authorized } from './authorized.service';
import CFActionsStore from '../stores/CFActionsStore';
import CentralDataStore from '../stores/CentralDataStore';
import * as CentralDataActions from '../actions/CentralDataActions';

function Title() {
	return <h4 className="form-title">User Access</h4>;
}

function Table(props) {
	return(
		<table className="table permissions-table">
			{props.children}
		</table>
	);
}

function Column1(props) {
	return(
		<th>
			<div className="form-group">
				<input 
					type="text"
					id="privileged-user"
					className="form-control"
					placeholder="Username or email address"
					disabled={!props.editMode ? true : false}
				/>
			</div>
		</th>	
	);
}

function Column2(props) {
	return(
		<th>
			<div className="form-group">
				<select
					id="selectpicker"
					data-width="100%" disabled={!props.editMode ? true : false}>
					<option>Read</option>
					<option>Write</option>
					<option>Admin</option>	
				</select>
			</div>
		</th>								
	);
}

class Column3 extends React.Component {
	constructor(props) {
		super(props);
	}

	addPermission() {
		let privilegedUser = document.getElementById('privileged-user').value;
		let selectedPermission = document.getElementById('selectpicker').value;
		let selectedAuthorized = {
			Admin: 'authorizedAdmins',
			Read: 'authorizedReaders',
			Write: 'authorizedWriters',
		};
		let hasUsers = Authorized.hasUsers(this.props.model.toJSON(), selectedAuthorized[selectedPermission]);

		if (!Authorized.verify(privilegedUser, this.props.model.toJSON())) {
			alert('An authorized user of that username already exists');
			return;
		}

		hasUsers.push(privilegedUser);

		CentralDataActions.updateAccountServers({
			modelIndex: this.props.modelIndex,
			permission: selectedAuthorized[selectedPermission],
			hasUsers
		});

		this.clear();
	}

	clear() {
		document.getElementById('privileged-user').value = '';
	}

	render() {
		return(
			<th>
				<div className="form-group">
					<button
						type="button"
						id="add-permission"
						onClick={() => this.addPermission()}
						className="btn btn-default"
						disabled={!this.props.editMode ? true : false}>Add</button>
				</div>
			</th>
		);
	}
}

class THead extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<thead>
				<tr>
					<Column1 editMode={this.props.editMode} />
					<Column2 editMode={this.props.editMode} />
					<Column3
						editMode={this.props.editMode}
						modelIndex={this.props.modelIndex}
						model={this.props.model}
					/>
				</tr>
			</thead>
		);
	}
}

class TBody extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			authorizedUsers: this.props.authorizedUsers
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			authorizedUsers: nextProps.authorizedUsers
		});
	}

	render() {
		return(
			<tbody>
				<tr>
					<td>{Parse.User.current().toJSON().username}</td>
					<td>Owner</td>
					<td>&nbsp;</td>
				</tr>
				{this.state.authorizedUsers}
			</tbody>
		);
	}
}

export default class UserAccess extends React.Component {
	constructor(props) {
		super(props);

		let accountServer = CentralDataStore.data.accountServers[this.props.modelIndex].toJSON();
		this.updateEditMode = this.updateEditMode.bind(this);
		this.updateAccountServer = this.updateAccountServer.bind(this);
		this.remove = this.remove.bind(this);
		this.parseAuthorizedUsers = this.parseAuthorizedUsers.bind(this);

		this.state = {
			editMode: CFActionsStore.editMode,
			authorizedUsers: this.parseAuthorizedUsers(accountServer, Authorized, CFActionsStore.editMode)
		}
	}

	componentDidMount() {
		CFActionsStore.on('change', this.updateEditMode);
		CentralDataStore.on('account_servers_updated', this.updateAccountServer);
	}

	componentWillUnmount() {
		CFActionsStore.removeListener('change', this.updateEditMode);
		CentralDataStore.removeListener('account_servers_updated', this.updateAccountServer);
	}

	parseAuthorizedUsers(accountServer, authorizedService, editMode) {
		let authorized = [];
		let authorizedList = {
			'Read': 'authorizedReaders',
			'Write': 'authorizedWriters',
			'Admin': 'authorizedAdmins'
		};
		let self = this;

		Object.keys(authorizedList).forEach(permission => {
			let propertyName = authorizedList[permission];
			let permissionList = authorizedService.list(permission, 'server-permission');

			if (accountServer.hasOwnProperty(propertyName)) {
				accountServer[propertyName].forEach((key, index) => {
					authorized.push(
						<tr key={key} data-user={accountServer[propertyName][index]}>
							<td data-permission={permissionList.selectedKey}>
								{accountServer[propertyName][index]}
							</td>
							<td>{permissionList.struc}</td>
							<td>{
								authorizedService.remove(
									accountServer[propertyName][index],
									permission,
									editMode,
									'server-permission',
									this.remove
								)
							}</td>
						</tr>
					);
				});
			}
		});

		return authorized;
	}

	remove(e) {
		let elem = document.getElementById(e.currentTarget.id);
		let permissions = {
			Admin: 'authorizedAdmins',
			Read: 'authorizedReaders',
			Write: 'authorizedWriters',
		};
		let self = this;
		let targetPermission = elem.getAttribute('data-permission');
		let targetUser = elem.getAttribute('data-user');
		let hasUsers = self.props.model.toJSON()[permissions[targetPermission]];
		let foundMatch = hasUsers.indexOf(targetUser);

		if (foundMatch > -1) {
			hasUsers.splice(foundMatch, 1);
		}

		CentralDataActions.updateAccountServers({
			modelIndex: this.props.modelIndex,
			permission: permissions[targetPermission],
			hasUsers
		});
	}

	render() {
		return(
			<div>
				<Title />
				<Table>
					<THead
						editMode={this.state.editMode}
						modelIndex={this.props.modelIndex}
						model={this.props.model}
					/>
					<TBody authorizedUsers={this.state.authorizedUsers} />
				</Table>			
			</div>
		);
	}

	updateEditMode() {
		this.setState({
			editMode: CFActionsStore.editMode
		});

		this.updateAccountServer();
	}

	updateAccountServer() {
		let accountServer = CentralDataStore.data.accountServers[this.props.modelIndex].toJSON();

		this.setState({
			authorizedUsers: this.parseAuthorizedUsers(accountServer, Authorized, CFActionsStore.editMode)
		});
	}
}

