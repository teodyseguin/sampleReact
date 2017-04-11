import React from 'react';
import Parse from 'parse';
import { Link } from 'react-router';
import { ServerService } from '../server/server.service';
import { ServerModel } from '../server/server.model';
import CentralDataStore from '../../../../stores/CentralDataStore';
import * as CentralDataActions from '../../../../actions/CentralDataActions';
import { AccountService } from '../account/account.service';

/**
 * ServerImage Component
 *
 * This is a child component of the Servers Component.
 * This holds an image uploaded by the user from the
 * server details page.
 */
function ServerImage(props) {
	return(
		<div className="col-md-2 server-image">
			<img src={props.photo && props.photo || null} className="img-responsive img-circle" />
		</div>
	);
}

/**
 * ServerStates Component
 *
 * This is a child component of the Servers Component.
 * This component displays the 4 workflow states bar
 * of a particular server item.
 *
 * - requested
 * - processing
 * - finished
 * - tested
 */
function ServerStates(props) {
	let requested = props.data.requested ? props.data.requested : false;
	let processing = props.data.processing ? props.data.processing : false;
	let finished = props.data.finished ? props.data.finished : false;
	let tested = props.data.tested ? props.data.tested : false;

	return(
		<div className="col-md-1 vertial-center states">
			<ul className="state">
				<li className={`state-item requested ${requested}`}></li>
				<li className={`state-item processing ${processing}`}></li>
				<li className={`state-item finished ${finished}`}></li>
				<li className={`state-item tested ${tested}`}></li>
			</ul>
		</div>							
	);
}

/**
 * DummyImage Component
 *
 * A child component of the Servers Component.
 * This component is intended for responsive purpose.
 * Initially kept hidden, but is shown on certain screen
 * breakpoints. It contains an image of privileged user.
 */
function DummyImage(props) {
	return(
		<div className="dummy- col-md-2">
			<img src="" className="img-responsive img-circle" />
		</div>		
	);
}

/**
 * ServerButtons Component
 *
 * A child component of Servers Component.
 * This component displays a group of buttons
 */
function ServerButtons(props) {
	return(
		<div className="col-md-3 server-last-column">
			<TopPhotoSeries dataObject={props.dataObject} data={props.data} dataID={props.dataID} />
			<ServerSwitch data={props.data} />
			<BottomPhotoSeries data={props.data} />
		</div>		
	);
}

/**
 * ServerSwitch Component
 *
 * A child component of the ServerButtons Component.
 * This component display a switch button, which is
 * used to set active or inactive a certain server item.
 */
function ServerSwitch(props) {
	let active = props.data.active ? 'checked' : '';

	return(
		<div className="server-buttons">
			<label className="switcher">
				<input type="checkbox" className={`switcher-input ${active}`} />
				<div className="switcher-slider"></div>
			</label>	
		</div>								
	);
}

/**
 * BottomPhotoSeries Component
 *
 * A child component of the ServerButtons Component.
 * This component display photos of privileged users
 * assign to moderate a certain server.
 */
function BottomPhotoSeries(props) {
	return(
		<div className="bottom-photo-series">
			<img src="" className="img-responsive img-circle" />
		</div>								
	);
}

/**
 * CreateServerField Component
 *
 * A child component of MainContent Component.
 * This is the component that displays the huge text field
 * from the dashboard page, which is use to enter server name
 * to be created by the user. If this field is left blank
 * and create server button is pressed from the footer, the
 * server name of that created server is 'Untitled Server'.
 */
function CreateServerField(props) {
	return(
		<header id="header">
			<input 
				type="text" 
				id="new-server" 
				className="new-server" 
				placeholder="Enter New Server Name" 
			/>
		</header>		
	);
}

/**
 * Stats Component
 *
 * This is a child component of MainContent Component.
 * Used to display some counters.
 */
function Stats(props) {
	return(
		<div id="stats">
			{props.children}
		</div>		
	);
}

/**
 * UserInfo Component
 *
 * This is a child component of Manage Component.
 * This component is use to display a greeting message
 * with the username/name of the logged in user
 */
function UserInfo(props) {
	return(
		<div id="user-info">
			<div className="inner">

			</div>
		</div>		
	);
}

/**
 * TopPhotoSeries Component
 *
 * A child component of ServerButtons component.
 * This component displays a group of buttons which
 * is intended to manage a server entity.
 */
class TopPhotoSeries extends React.Component {
	constructor(props) {
		super(props);
	}

	deleteServer() {
		let self = this;
		self.props.dataObject.destroy({
			success(obj) {
				let x = document.getElementById(`${self.props.dataObject.id}`);
				x.parentElement.removeChild(x);
			},
			error(obj, error) {
				throw new Error(error.message);
			}
		});
	}

	handleClick(e) {
		switch(e.currentTarget.id) {
			case 'delete':
				this.deleteServer();
				break;
		}
	}

	render() {
		return(
			<div className="top-photo-series">
				<div className="btn-group">
					<button type="button" className="btn btn-default btn-wbg warning"></button>
					<button type="button" className="btn btn-default btn-wbg error"></button>
					<button type="button" className="btn btn-default btn-wbg running"></button>
					<button type="button" className="btn btn-default btn-wbg maintenance"></button>
					<button type="button" className="btn btn-default btn-wbg computer"></button>
					<button 
						type="button" 
						id="delete" 
						data-id={this.props.dataID}
						className="btn btn-default btn-wbg delete" 
						onClick={(e) => this.handleClick(e)}></button>
				</div>
			</div>
		);
	}
}

/**
 * ServerDetailList Component
 *
 * This is a child component of Servers component.
 * This component displays the textual details of a
 * particular server entity. E.g. server name, created date
 * panda type etc.
 */
class ServerDetailList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let serverName = this.props.data.serverName ? this.props.data.serverName : 'Not set';
		let created = this.props.data.createdAt ? this.props.data.createdAt : 'Not set';
		let pandaType = this.props.data.pandaType ? this.props.data.pandaType : 'Not set';
		let memory = this.props.data.memory ? this.props.data.memory : 'Not set';
		let storage = this.props.data.storage ? this.props.data.storage : 'Not set';
		let active = this.props.data.active ? this.props.data.active : 'false';
		let transferSize = this.props.data.transferRate ? this.props.data.transferRate : 'Not set';

		return(
			<Link to={`/dashboard/server/${this.props.dataID}`}>
			<div className="col-md-5 server-details-list">
				<ul className="server-details">
					<li className="server-name">Name: {serverName}</li>
					<li>Created: {created}</li>
					<li>Panda Type: {pandaType}</li>
					<li>Memory: {memory}</li>
					<li>Storage: {storage}</li>
					<li>Active: {active}</li>
					<li>Transfer Size: {transferSize}</li>
				</ul>
			</div>
			</Link>
		);
	}
}

/**
 * Footer Component
 *
 * This component is a child component of Manage component.
 * The footer contains some filter navigation links, as well
 * as the create new server button.
 */
class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	createServer() {
		let self = this;
		ServerService.createServer(
			document.getElementById('new-server').value,		
			Parse,
			new ServerModel(),
			CentralDataStore.data.activeAccount
		).then((result) => {
			self.props.getServers();
			document.getElementById('new-server').value = '';
		});
	}

	render() {
		return(
			<div className="mmlistview">
				<footer id="footer">
					<div className="row">
						<div className="col-md-4 footer-column">
							<span id="todo-count">
								<strong>remaining</strong> 1 active server
							</span>
						</div>
						<div className="cold-md-4 footer-column">
							<ul id="filters">
								<li><a href="javascript:;" id="all" className="selected">All</a></li>
								<li><a href="javascript:;" id="active">Active</a></li>
								<li><a href="javascript:;" id="inactive">InActive</a></li>
							</ul>
						</div>
						<div className="col-md-4 footer-column">
							<button 
								id="clear-completed" 
								className="btn btn-primary" 
								onClick={(e) => this.createServer(e)}>+ New Server</button>
						</div>
					</div>
				</footer>
			</div>
		);
	}
}

/**
 * Servers Component
 *
 * This is a child component of the MainContent Component.
 * This component is the list item itself of a particular server item.
 * It displays the details associated to the server and some
 * buttons to manage this server.
 */
class Servers extends React.Component {
	constructor(props) {
		super(props);
		this.servers = null;
	}

	componentWillReceiveProps(nextProps) {
		let servers = [];

		nextProps.contents.forEach(key => {
			servers.push(
				<li key={key.id} id={key.id} className="view-server-details">
					<ServerImage photo={key.toJSON().photo && key.toJSON().photo || null} />
					<ServerStates data={key.toJSON()} />
					<ServerDetailList data={key.toJSON()} dataID={key.id} />
					<DummyImage photo={key.toJSON().photo && key.toJSON().photo || null} />
					<ServerButtons dataObject={key} data={key.toJSON()} dataID={key.id} />
				</li>		
			);
		});

		this.servers = servers;
	}

	render() {
		return <ul>{this.servers}</ul>;
	}
}

/**
 * MainContent Component
 *
 * A child component of Manage component
 * This component, displays the huge textfield
 * for entering a new Server Name to be created.
 */
class MainContent extends React.Component {
	constructor(props) {
		super(props);
		this.servers = [];
	}

	componentWillReceiveProps(nextProps) {
		this.servers = nextProps.contents;
	}

	render() {
		return(
			<div className="section todo-section server-list-section">
				<CreateServerField />
				<div id="main">
					<Servers contents={this.servers} />
				</div>
				<Stats></Stats>
			</div>
		);	
	};
}

/**
 * Manage Component
 *
 * This is the main component that is being used to display a
 * list of servers in the /dashboard or /dashboard/account/:accountID
 * page.
 */
export default class Manage extends React.Component {
	constructor(props) {
		super(props);

		this.updateContents = this.updateContents.bind(this);
		this.state = {contents: []};
	}

	componentDidMount() {
		CentralDataStore.on('central_data_updated', this.updateContents);
		CentralDataStore.on('active_account_id_updated', this.updateContents);
	}

	componentWillUnmount() {
		CentralDataStore.removeListener('central_data_updated', this.updateContents);
		CentralDataStore.removeListener('active_account_id_updated', this.updateContents);
	}

	getServers() {
		var self = this;
		ServerService.getServers(
			Parse, 
			CentralDataStore.data.activeAccount,
			(error, results) => {
				if (error) {
					throw new Error(error);	
				}

				self.setState({
				  contents: results 
				});

				this.props.parentState.setState({
					accountServers: results
				});
			}
		);
	}

	render() {
		return(
			<div>
				<UserInfo />
				<MainContent
					parentState={this.props.parentState}
					contents={this.state.contents}
				/>
				<Footer parentState={this.props.parentState} getServers={() => this.getServers()} />
			</div>
		);
	}

	updateContents() {
		this.setState({
			contents: CentralDataStore.data.accountServers
		});
	}
}

