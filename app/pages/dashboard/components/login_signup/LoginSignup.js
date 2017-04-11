import React from 'react';
import Parse from 'parse';
import { Link } from 'react-router';
import { AccountService } from '../account/account.service';
import Form from '../../../../shared/Form';
import * as CentralDataActions from '../../../../actions/CentralDataActions';
import CentralDataStore from '../../../../stores/CentralDataStore';

/**
 * Login component
 *
 * @param props
 * 	contains the parentState props
 *
 * @return
 * 	a Form DOM for user log in
 */
function Login(props) {
	function _login() {
		Parse.User.logIn(
			document.getElementById('login-username').value,
			document.getElementById('login-password').value, {
			success(user) {
				AccountService.accounts(Parse, {}, function(error, accounts) {
					if (error) {
						throw new Error(error);
					}

					CentralDataActions.updateCentralData(
						AccountService.accountWrapper(accounts, Parse.User.current()),
						'successful login'
					);

					props.parentState.setState((prevState, props) => (
						AccountService.accountWrapper(accounts, Parse.User.current())
					));

					// make sure to redirect the page if conditions are true 
					if (accounts.length && accounts[0].hasOwnProperty('id')) {
					  window.location.href = `/dashboard/account/${accounts[0].id}`;
					}
				});
			},
			error(user, error) {
				let loginAlert  = document.getElementById('login-alert');
				loginAlert.classList.remove('hidden');
				loginAlert.innerHTML = error.message;
			}
		});
	}

	return(
		<Form classes="login-form">
			<h1>Log In</h1>
			<div id="login-alert" className="error alert alert-danger hidden" role="alert"></div>
			<input
				className="form-control"
				type="text"
				id="login-username"
				placeholder="Email"
			/>
			<br />
			<input className="form-control" type="password" id="login-password" placeholder="Password" />
			<br />
			<button type="button" className="btn btn-warning btn-lg" onClick={_login}>Log In</button>
		</Form>
	);

}

/**
 * Signup component
 *
 * @param props
 * 	it contains the parentState props
 *
 * @return
 * 	a Form DOM for user sign up
 */
function Signup(props) {
	function _signUp() {
		let userName = document.getElementById('signup-username').value;
		let password = document.getElementById('signup-password').value;
		let newUser = new Parse.User();

		newUser.set('username', userName);
		newUser.set('password', password);
		newUser.set('email', userName);
		newUser.set('firstName', null);
		newUser.set('lastName', null);
		newUser.set('photo', null);

		newUser.signUp(null, {
			success(user) {
				AccountService.accounts(Parse, {}, function(error, accounts) {
					if (error) {
						throw new Error(error);
					}

					CentralDataActions.updateCentralData(
						AccountService.accountWrapper(accounts, Parse.User.current()),
						'successful signup'
					);

					props.parentState.setState((prevState, props) => (
						AccountService.accountWrapper(accounts, Parse.User.current())
					));
				});
			},
			error(user, error) {
				let signUpAlert = document.getElementById('signup-alert');
				signUpAlert.classList.remove('hidden');
				signUpAlert.innerHTML = error.message;
			}
		});
	}

	return(
		<Form classes="signup-form">
			<h1>Sign Up</h1>
			<div id="signup-alert" className="error alert alert-danger hidden" role="alert"></div>
			<input className="form-control" type="text" id="signup-username" placeholder="Email" />
			<br />
			<input className="form-control" type="password" id="signup-password" placeholder="Create a Password" />
			<br />
			<button type="button" className="btn btn-warning btn-lg" onClick={_signUp}>Sign Up</button>
		</Form>		
	);
}

export default class LoginSignup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div className="login">
			  <div id="headerwrap">
				  <div className="container">
						<div className="row">
							<div className="col-lg-4"></div>
							<div className="col-lg-4 login-form-column">
								<Login parentState={this.props.parentState} />
								<Signup parentState={this.props.parentState} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
} 

