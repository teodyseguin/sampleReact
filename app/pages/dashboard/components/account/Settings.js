import React from 'react';
import Spinner from '../../../../shared/Spinner';
import CFActions from '../../../../shared/CFActions';
import ImageUpload from '../../../../shared/ImageUpload';
import UserAccess from '../../../../shared/UserAccess';
import UserBilling from '../../../../shared/UserBilling';
import SettingsStore from '../../../../stores/SettingsStore';
import * as SettingsActions from '../../../../actions/SettingsActions';
import CentralDataStore from '../../../../stores/CentralDataStore';
import * as CentralDataActions from '../../../../actions/CentralDataActions';

/**
 * Article Component
 *
 * This component is a child component of the Settings Component
 */
class Article extends React.Component {
	constructor(props) {
		super(props);

		this.fields = [
			'account-name',
		];
	}

	save() {
		let account = this.props.account;
		account.set('accountName', document.getElementById('account-name').value);
		account.set('billingInfo', SettingsStore.account.billingInfo);
		account.save(null, {
			success(account) {
				alert('Success updating your Account!');
			},
			error(account, error) {
				throw new Error(error.message);
			}
		});
	}

	render() {
		return(
			<article>
				<header>
					<CFActions
						classes="server-details-actions"
						fields={this.fields}
						save={(e) => this.save()}
						router={this.props.router}
					/>
					<ImageUpload />
				</header>
				<AccountForm accountName={
					this.props.account ? this.props.account.toJSON().accountName : null
				} />
				<br />
				<UserBilling account={this.props.account ? this.props.account: null} />
			</article>
		);
	}
}

/**
 * AccountForm Component
 *
 * This is a child component of Article Component.
 */
class AccountForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<form id="user-account-form">
				<div className="form-group">
					<label>Account name:</label>
					<input
						type="text"
						className="form-control"
						id="account-name"
						placeholder="e.g. johnsmith001"
						defaultValue={this.props.accountName}
					/>
				</div>
			</form>
		);
	}
}

/**
 * Settings Component
 *
 * This component is used in dashboard/<account id>/settings page
 */
export default class Settings extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<section id="account-section">
				<Spinner />
				<Article 
					account={CentralDataStore.data.activeAccount}
					router={this.props.router}
				/>
			</section>
		);
	}
}

