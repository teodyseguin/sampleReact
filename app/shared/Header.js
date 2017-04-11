import React from 'react';
import { Link } from 'react-router';
import { Modal, NavDropdown } from 'react-bootstrap';
import { AccountService } from '../pages/dashboard/components/account/account.service';
import { Account } from '../pages/dashboard/components/account/account.model';
import Parse from 'parse';
import HeaderStore from '../stores/HeaderStore';
import * as HeaderActions from '../actions/HeaderActions';
import CentralDataStore from '../stores/CentralDataStore';
import * as CentralDataActions from '../actions/CentralDataActions';

function Navbar(props) {
	return(
		<header className="header-content">
			<div className="navbar navbar-default navbar-fixed-top">
				<div className="container">
					{props.children}
				</div>
			</div>
		</header>
	);
}

function NavbarButtons(props) {
	return(
		<div className="navbar-header">
			<button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
			</button>
		</div>		
	);
}

function Logo(props) {
	return(
		<div className="col-lg-5">
			<a href="/">
				<img className="panda-logo" src={props.name} />
			</a>
		</div>
	);
}

/**
 * Navbar menu component
 */
function NavbarMenu(props) {
	return(
		<div className="navbar-collapse collapse">
			<ul className="nav navbar-nav navbar-right">
				<li><a href="/">Home</a></li>
				<li><a href="/how-it-works.html">How it Works</a></li>
				<li><a href="/pricing.html">Pricing</a></li>
				{props.dashboardLink}
				{props.profileLink}
				{props.createAccountLink}
				{props.signOutLink}
				{props.accountLink}
			</ul>
		</div>		
	);
}

/**
 * Create new account modal component
 */
class CreateAccountModal extends React.Component {
	constructor(props) {
		super(props);
	}

	createAccount() {
		let account = new Account();
		let accountName = document.getElementById('new-account');
		let ownerPointer = Parse.User.current();
		let ownerPFObjectID = Parse.User.current().id;
		let self = this;

		if (accountName.value === '') {
			return;
		}

		account.set('accountName', accountName.value);
		account.set('ownerPointer', ownerPointer);
		account.set('ownerPFObjectID', ownerPFObjectID);
		account.save(null, {
			success(acc) {
				let accounts = CentralDataStore.data.accounts;

				if (!accounts) {
					accounts = [acc];
				}
				else {
					accounts.push(acc);
				}

				CentralDataActions.updateCentralData({
					accounts,
					accountToDisplay: acc.toJSON().accountName,
					accountList: AccountService.accountList(accounts),
					activeAccount: acc,
					activeAccountID: acc.id,
					accountServers: null,
					thumbnail: null,
					user: Parse.User.current()
				});

				self.props.onHide();
				self.props.router.push(`/dashboard/account/${account.id}`);
			},
			error(account, error) {
				throw new Error(error.message);
			}
		});
	}

	handleClick(e) {
		switch(e.currentTarget.id) {
			case 'create-account':
				this.createAccount();
				break;
		}
	}

	render() {
		return(
			<Modal
				show={this.props.show}
				onHide={this.props.onHide}
				bsSize="large"
				aria-labelledby="contained-modal-title-lg">
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">Create new account</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<div className="form-group">
							<label>Enter new account name</label>
							<input type="text" id="new-account" className="form-control" placeholder="e.g. My awesome account!" />
						</div>
					</form>
					<button
						type="button"
						id="create-account"
						className="btn btn-primary"
						onClick={(e) => this.handleClick(e)}>Create your account
					</button>
				</Modal.Body>
				<Modal.Footer>
				</Modal.Footer>
			</Modal>
		);
	}
}

/**
 * Dropdown component
 */
class DropDown extends React.Component {
	constructor(props) {
		super(props);

		this.updateAccountSettingsPath = this.updateAccountSettingsPath.bind(this);
		this.updateDropDownState = this.updateDropDownState.bind(this);
		this.state = {
			dropDownIsOpen: HeaderStore.expanded,
			showModal: false,
			accountSettingsPath: `/dashboard/account/${CentralDataStore.data.activeAccountID}/settings`
		};
	}

	componentDidMount() {
		CentralDataStore.on('active_account_id_updated', this.updateAccountSettingsPath);
		HeaderStore.on('change', this.updateDropDownState);
	}

	componentWillUnmount() {
		CentralDataStore.removeListener('active_account_id_updated', this.updateAccountSettingsPath);
		HeaderStore.removeListener('change', this.updateDropDownState);
	}

	updateAccountSettingsPath() {
		this.setState({
			accountSettingsPath: `/dashboard/account/${CentralDataStore.data.activeAccountID}/settings`
		});
	}

	updateDropDownState() {
		this.setState({
			dropDownIsOpen: HeaderStore.expanded
		})
	}

	/**
	 * Handle the click event for each menu item
	 * and designate them to the appropriate method
	 * to accomplish the specified task
	 */
	handleClick(e) {
		switch(e.currentTarget.id) {
			case 'sign-out':
				this.signOut();
				this.setState({
					dropDownIsOpen: false
				});

				break;

			case 'create-new-account':
				this.setState({
					showModal: true
				});
				this.setState({
					dropDownIsOpen: false
				});

				break;

			default:
				this.setState({
					dropDownIsOpen: false
				});

				CentralDataActions.updateActiveAccountID(this.props.router.params.accountID);

				break;
		}
	}

	/**
	 * Expand/Collapse the dropdown on the account menu
	 */
	showMenu() {
		if (this.state.dropDownIsOpen) {
			this.setState({
				dropDownIsOpen: false
			});
		}
		else {
			this.setState({
				dropDownIsOpen: true
			});
		}
	}

	/**
	 * Sign out the current user and reload and
	 * redirect the page the /dashboard
	 */
	signOut() {
		Parse.User.logOut().then(() => {
			localStorage.clear();
			window.location = `${window.location.origin}/dashboard`;
		},
		(error) => {
			throw new Error(error);
		});
	}

	render() {
		return(
			<ul
				id="dropdown-menu"
				className={this.state.dropDownIsOpen && 'dropdown-menu' || 'dropdown-menu hidden'}>
				<li>
					<Link to={this.state.accountSettingsPath} id="account-settings" onClick={(e) => this.handleClick(e)}>
						Account settings
					</Link>
				</li>
				<li><a href="mailto:hello@pandaclouds.com?subject=">Send feedback</a></li>
				<li className="divider"></li>
				<li>
					<a href="javascript:;">Switch Account</a>
					<div onClick={(e) => this.handleClick(e)}>
						{CentralDataStore.data.accountList}
					</div>
				</li>
				<li className="divider"></li>
				<li>
					<a href="javascript:;" id="create-new-account" onClick={(e) => this.handleClick(e)}>Create new account</a>
					<CreateAccountModal
						show={this.state.showModal}
						onHide={() => this.setState({showModal: false})}
						router={this.props.router}
					/>
				</li>
				<li className="divider"></li>
				<li><a href="javascript:;" id="sign-out" onClick={(e) => this.handleClick(e)}>Sign out</a></li>
			</ul>
		);
	}
}

export default class Header extends React.Component {
	constructor(props) {
		super(props);

		this.updateDropDownState = this.updateDropDownState.bind(this);
		this.updateCentralDataStore = this.updateCentralDataStore.bind(this);
		this.updateAccountToDisplay = this.updateAccountToDisplay.bind(this);
		this.state = {
			dropDownIsOpen: false,
			showModal: false,
			accountToDisplay: CentralDataStore.data.accountToDisplay,
			accountLink: null
		};
	}

	componentDidMount() {
		CentralDataStore.on('account_to_display_updated', this.updateAccountToDisplay);
		HeaderStore.on('change', this.updateDropDownState);
		CentralDataStore.on('central_data_updated', this.updateCentralDataStore);
		CentralDataStore.on('active_account_id_updated', this.updateCentralDataStore);
	}

	componentWillUnmount() {
		CentralDataStore.removeListener('account_to_display_updated', this.updateAccountToDisplay);
		HeaderStore.removeListener('change', this.updateDropDownState);
		CentralDataStore.removeListener('central_data_updated', this.updateCentralDataStore);
		CentralDataStore.removeListener('active_account_id_updated', this.updateCentralDataStore);
	}

	updateDropDownState() {
		this.setState({
			dropDownIsOpen: HeaderStore.expanded
		});
	}

	updateCentralDataStore() {
		this.setState({
			accountToDisplay: CentralDataStore.data.accountToDisplay,
			accountLink: this.accountLink()
		});
	}

	updateAccountToDisplay() {
		this.setState({
			accountToDisplay: CentralDataStore.data.accountToDisplay
		});
	}

	accountLink() {
		if (!CentralDataStore.data.user || !CentralDataStore.data.accounts.length) {
			return null;
		}

		let parentState = this.props.parentState.state;
		let thumbnail = CentralDataStore.data.thumbnail && <img src={CentralDataStore.data.thumbnail} /> || <span className="glyphicon glyphicon-user"></span>;

		return(
			<li className={CentralDataStore.data.accounts && 'dropdown' || 'dropdown hidden'}>
				<a
					href="javascript:;"
					data-toggle="dropdown"
					id="dropdown"
					className="dropdown-toggle"
					onClick={(e) => this.handleClick(e)}>
					{thumbnail}
					<span id="account-to-display">
						{CentralDataStore.data.accountToDisplay}
					</span>
					<b className="caret"></b>
				</a>
				<DropDown
					parentState={this.props.parentState}
					dropDownState={this}
					router={this.props.router}
				/>
			</li>
		);
	}

	handleClick(e) {
		switch(e.currentTarget.id) {
			case 'create-new-account':
				this.setState({
					showModal: true
				});

				break;

			case 'dropdown':
				if (this.state.dropDownIsOpen) {
					HeaderActions.expand(false);
				}
				else {
					HeaderActions.expand(true);
				}

				break;
		}
	}

	render() {
		// See Home.js for the initial meaning of this state
		let parentState = this.props.parentState.state;
		let createAccountLink = null;
		let dashboardLink = <li><Link to="/dashboard">Dashboard</Link></li>;
		let profileLink = (Parse.User.current() && window.location.pathname !== '/') && <li><Link to="/dashboard/profile">Profile</Link></li> || null;
		let signOutLink = null;

		// dashboard link should always point to the account path
		// (containing the account ID) whenver a user is logged in
		if (CentralDataStore.data.user && CentralDataStore.data.activeAccountID) {
			let path = `/dashboard/account/${CentralDataStore.data.activeAccountID}`;
			dashboardLink = <li><Link to={path}>Dashboard</Link></li>;
		}

		// we only want to show the create new account and signout
		// when there is a user currently logged in, and if or he/she
		// doesn't have any accounts yet
		if (CentralDataStore.data.user && !CentralDataStore.data.accounts.length) {
			createAccountLink = <li>
				<a href="javascript:;" id="create-new-account" onClick={(e) => this.handleClick(e)}>Create new account</a>
				<CreateAccountModal
					show={this.state.showModal}
					onHide={() => this.setState({showModal: false})}
					router={this.props.router}
				/>
			</li>;
			signOutLink = <li><a href="javascript:;" id="sign-out">Sign Out</a></li>;
		}

		return(
			<Navbar>
				<NavbarButtons />
				<Logo name={this.props.logo} />
				<NavbarMenu
					parentState={this.props.parentState}
					profileLink={profileLink}
					dashboardLink={dashboardLink}
					createAccountLink={createAccountLink}
					signOutLink={signOutLink}
					accountLink={this.state.accountLink}
				/>
			</Navbar>			
		);
	}
}

