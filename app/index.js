import React from 'react';
import ReactDOM from 'react-dom';
import Parse from 'parse';
import ParseReact from 'parse-react';
import { AppConfig } from './config.js';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Dashboard from './pages/dashboard/Dashboard';
import Manage from './pages/dashboard/components/manage/Manage';
import Profile from './pages/dashboard/components/profile/Profile';
import Server from './pages/dashboard/components/server/Server';
import Account from './pages/dashboard/components/account/Account';
import { AccountService } from './pages/dashboard/components/account/account.service';
import Settings from './pages/dashboard/components/account/Settings';
import Home from './pages/home/Home';
import '../assets/css/bootstrap.min';
import '../assets/css/styles';
import '../assets/css/fonts';

(function() {
	Parse.initialize(AppConfig.parseAppId, AppConfig.parseJSKey);
	Parse.serverURL = 'https://app-domain.com/parse';

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
				'index',
			);

			/*self.props.parentState.setState((prevState, props) => (
				AccountService.accountWrapper(accounts, Parse.User.current())
			));*/
		});
})();

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path='/' component={Home} />
		<Route path='/dashboard' component={Dashboard}>
			<Route path='profile' component={Profile} />
			<Route path='account/:accountID' component={Account} />
			<Route path="account/:accountID/settings" component={Settings} />
			<Route path="server/:serverID" component={Server} />
		</Route>
	</Router>
, document.getElementById('app-content'));

