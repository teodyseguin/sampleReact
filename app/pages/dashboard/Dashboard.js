import React from 'react';
import Parse from 'parse';
import LoginSignup from './components/login_signup/LoginSignup';
import CentralDataStore from '../../stores/CentralDataStore';
import * as CentralDataActions from '../../actions/CentralDataActions';
import { AccountService } from '../../pages/dashboard/components/account/account.service';
import Header from '../../shared/Header';
import HeaderStore from '../../stores/HeaderStore';
import * as HeaderActions from '../../actions/HeaderActions';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			accounts: null,
			accountList: null,
			activeAccount: null,
			activeAccountID: null,
			accountToDisplay: null,
			thumbnail: null,
			user: null
		};

		let self = this;

		if (!Parse.User.current()) {
			return;
		}

		AccountService.accounts(Parse, {}, function(error, accounts) {
			if (error) {
				throw new Error(error);
			}

			CentralDataActions.updateCentralData(
				AccountService.accountWrapper(accounts, Parse.User.current()),
				'Dashboard page',
			);
		});
	}

	componentDidMount() {
		CentralDataStore.on('central_data_updated', () => {
			if (CentralDataStore.data.activeAccountID) {
				this
					.props
					.router
					.push(`/dashboard/account/${CentralDataStore.data.activeAccountID}`);
			}
			else {
				setTimeout(() => {
					let element = document.getElementById('create-new-account');

					if (element.onclick) {
						element.onclick();
					}
					else {
						element.click();
					}
				}, 1000);
			}
		});
	}

	bodyClick(e) {
		if ((e.target.id !== 'account-to-display') && (HeaderStore.expanded)) {
			HeaderActions.expand(false);
		}
	}

	render() {
		if (Parse.User.current()) {
			return(
				<div id="body-wrapper" onClick={(e) => this.bodyClick(e)} style={{overflow: 'hidden'}}>
					<Header logo="../../../assets/img/Panda-No-Background.png" parentState={this} router={this.props.router} />
					{this.props.children}
				</div>
			);
		}
		else {
			return(
				<div>
					<Header
						logo="../../../assets/img/Panda-No-Background.png"
						parentState={this}
						router={this.props.router}
					/>
					<LoginSignup parentState={this} />
				</div>
			);
		}
	}
}

