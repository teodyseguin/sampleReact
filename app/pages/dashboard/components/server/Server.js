import React from 'react';
import Parse from 'parse';
import { ServerModel } from './server.model';
import Spinner from '../../../../shared/Spinner';
import CFActions from '../../../../shared/CFActions';
import ImageUpload from '../../../../shared/ImageUpload';
import UserAccess from '../../../../shared/UserAccess';
import ImageUploadStore from '../../../../stores/ImageUploadStore';
import * as ImageUploadActions from '../../../../actions/ImageUploadActions';
import { Panda } from './panda.service';
import _ from 'lodash';
import CentralDataStore from '../../../../stores/CentralDataStore';

/**
 * Article Component
 *
 * This component is a child component of Server Component.
 * This component is used as a main wrapper for the ServerForm Component.
 */
class Article extends React.Component {
	constructor(props) {
		super(props);

		this.fields = [
			'server-name',
			'panda-types',
			'switcher',
			'upload'
		];
	}

	save() {
		let server = CentralDataStore.data.accountServers[this.props.contentLocation];

		server.set('active', document.getElementById('switcher').checked);
		server.set('serverName', document.getElementById('server-name').value);
		server.set('memorySize', document.getElementById('memory').value);
		server.set('pandaType', document.getElementById('panda-types').value);
		server.set('storageSize', document.getElementById('storage').value);
		server.set('transferRate', document.getElementById('transfer').value);
		server.set('photo', ImageUploadStore.upload);

		server.save(null, {
			success(result) {
				alert('Server detail is updated successfully!');
			},
			error(result, error) {
				alert('Something went wrong while saving the server details.');
			}
		});
	}

	render() {
		let accountServers = CentralDataStore.data.accountServers;
		let contentLocation = this.props.contentLocation;
		let photo = accountServers[contentLocation].toJSON().photo ? accountServers[contentLocation].toJSON().photo.url : null;
		let modelIndex = _.findIndex(CentralDataStore.data.accountServers, {'id': this.props.router.params.serverID});
		let model = CentralDataStore.data.accountServers[modelIndex];

		return(
			<article>
				<header>
					<CFActions
						classes="server-details-actions"
						fields={this.fields}
						save={(e) => this.save()}
						router={this.props.router}
					/>
					<ImageUpload photo={photo} />
				</header>
				<ServerForm
					parentState={this.props.parentState}
					contentLocation={this.props.contentLocation}
				/>
				<UserAccess
					router={this.props.router}
					model={model}
					modelIndex={modelIndex}
				/>
			</article>
		);
	}
}

/**
 * Switcher Component
 *
 * This component is a child component of ServerForm Component.
 * This component is a switcher button which is use to set active
 * or in active a particular Server.
 */
class Switcher extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		// we make sure that the component is mounted before checking
		// for the property checked. If we put this statement within
		// the constructor's execution, the execution will be ahead of
		// time and thus won't be able to find the element switcher
		document
			.getElementById('switcher')
			.checked = this.props.active && this.props.active || false;
	}

	handleChange(e) {
		switch(e.currentTarget.id) {
			case 'switcher':
				this.props.serverFormState.setState({
					active: e.currentTarget.checked
				});

				break;
		}
	}

	render() {
		return(
			<div className="row switcher-wrapper">
				<div className="switcher-content content">
					<label className="switcher">
						<input
							type="checkbox"
							id="switcher"
							className="switcher-input"
							onChange={(e) => this.handleChange(e)}
							disabled />
						<div className="switcher-slider" />
					</label>
					<span>server is {this.props.active ? 'active': 'inactive'}</span>
				</div>
			</div>
		);
	}
}

/**
 * MemorySize Component
 *
 * This is a child component of ServerForm Component.
 * This component is used to display the memorySize value
 * of a particular Server.
 */
class MemorySize extends React.Component {
	render() {
		return(
			<div className="form-group">
				<label className="left-text">Memory size:</label>
				<input
					id="memory"
					className="form-control"
					value={this.props.memorySize}
					disabled />
			</div>
		);
	}
}

/**
 * StorageSize Component
 *
 * This component is a child component of ServerForm Component.
 * This component displays the storageSize value of a particular Server.
 */
class StorageSize extends React.Component {
	render() {
		return(
			<div className="form-group">
				<label className="left-text">Storage size:</label>
				<input
					id="storage"
					className="form-control"
					value={this.props.storageSize}
					disabled />
			</div>
		);
	}
}

/**
 * TransferRate Component
 *
 * This component is a child component of ServerForm Component.
 * This component displays the transferRate size of a Server.
 */
class TransferRate extends React.Component {
	render() {
		return(
			<div className="form-group">
				<label className="left-text">Transfer rate:</label>
				<input
					id="transfer"
					className="form-control"
					value={this.props.transferRate}
					disabled />
			</div>
		);
	}
}

/**
 * PandaType Component
 *
 * This component is a child component of ServerForm Component.
 * This component is used to display a combo box which contains
 * different types of Panda values, were a user may select from.
 * Panda values are starting from Panda 1 to 9.
 */
class PandaType extends React.Component {
	constructor(props) {
		super(props)
	}

	/**
	 * Assign the appropriate field values, depending on what type
	 * Panda is chosen from the selection box.
	 */
	choosePanda(e) {
		let panda = new Panda(e.target.value);
		let type = panda.type;
		this.props.serverFormState.setState({
			memorySize: type.memory,
			storageSize: type.storage,
			transferRate: type.transfer
		});
	}

	render() {
		return(
			<div className="form-group">
				<label className="left-text">Panda Type:</label>
				<select
					className="form-control"
					id="panda-types"
					defaultValue={this.props.pandaType}
					onChange={(e) => this.choosePanda(e)}
					disabled>
					<option value=""> -- Select -- </option>
					<option value="Panda 1">Panda 1</option>
					<option value="Panda 2">Panda 2</option>
					<option value="Panda 3">Panda 3</option>
					<option value="Panda 4">Panda 4</option>
					<option value="Panda 5">Panda 5</option>
					<option value="Panda 6">Panda 6</option>
					<option value="Panda 7">Panda 7</option>
					<option value="Panda 8">Panda 8</option>
					<option value="Panda 9">Panda 9</option>
				</select>
			</div>
		);
	}
}

/**
 * ServerForm Component
 *
 * This component is a child component of Article component.
 * This component represents a form which is used to enter
 * information for a particular Server entity.
 */
class ServerForm extends React.Component {
	constructor(props) {
		super(props);

		let server = CentralDataStore.data.accountServers[this.props.contentLocation].toJSON();

		this.state = {
			serverName: server.serverName,
			active: server.active,
			pandaType: server.pandaType ? server.pandaType : 'null',
			memorySize: server.memorySize ? server.memorySize : 'None',
			storageSize: server.storageSize ? server.storageSize : 'None',
			transferRate: server.transferRate ? server.transferRate : 'None'
		}
	}

	handleChange(e) {
		switch (e.currentTarget.id) {
			case 'server-name':
				this.setState({
					serverName: e.target.value
				});
				break;
		}
	}

	render() {
		return(
			<form id="server-form">
				<h1>
					<input
						type="text"
						placeholder="Server Name"
						id="server-name"
						value={this.state.serverName}
						onChange={(e) => this.handleChange(e)}
						disabled
					/>
				</h1>
				<Switcher
					active={this.state.active}
					serverFormState={this} />
				<PandaType
					pandaType={this.state.pandaType}
					serverFormState={this} />
				<MemorySize
					memorySize={this.state.memorySize}
					serverFormState={this} />
				<StorageSize
					storageSize={this.state.storageSize}
					serverFormState={this} />
				<TransferRate
					transferRate={this.state.transferRate}
					serverFormState={this} />
			</form>
		);
	}
}

/**
 * Server Component
 *
 * This is the component exposed to the app. This component
 * is used to display the Server information from it's dedicated page
 */
export default class Server extends React.Component {
	constructor(props) {
		super(props);

		let servers = CentralDataStore.data.accountServers;
		let serverID = this.props.params.serverID;
		let server = _.filter(servers, ['id', serverID]);

		this.state = {
			server: server,
		};

		this.contentLocation = _.findIndex(
			CentralDataStore.data.accountServers,
			['id', this.props.params.serverID]
		);
	}

	render() {
		return(
			<section className="server-details-contents">
				<Spinner />
				<Article
					parentState={this.props.parentState}
					contentLocation={this.contentLocation}
					router={this.props.router}
				/>
			</section>			
		);	
	}
}

