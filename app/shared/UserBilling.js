import React from 'react';
import Parse from 'parse';
import CFActionsStore from '../stores/CFActionsStore';
import SettingsStore from '../stores/SettingsStore';
import * as SettingsActions from '../actions/SettingsActions';

/**
 * Table Component
 *
 * This is a child component of the CreditCardForm Component.
 * This component is used to display a list of credit cards
 * added by the user to it's account.
 */
class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {rows: null};
	}

	componentDidMount() {
		let rows = [];

		if (!this.billingInfo) {
			return;
		}

		this.props.billingInfo.forEach(key => {
			rows.push(
				<tr key={key.data.id} data-id={key.data.id}>
					<td>{key.name}</td>
					<td>{key.data.card.brand} **** **** **** {key.data.card.last4}</td>
					<td>{key.data.card.exp}</td>
				</tr>
			)
		});

		this.setState({rows});
	}

	componentWillReceiveProps(nextProps) {
		let rows = [];

		if (!nextProps.billingInfo) {
			return;
		}

		nextProps.billingInfo.forEach(key => {
			rows.push(
				<tr key={key.data.id} data-id={key.data.id}>
					<td>{key.name}</td>
					<td>{key.data.card.brand} **** **** **** {key.data.card.last4}</td>
					<td>{key.data.card.exp}</td>
				</tr>
			)
		});

		this.setState({rows});
	}

	render() {
		return(
			<table id="credit-card-table" className="table">
				<thead></thead>
				<tbody>
					{this.state.rows}
				</tbody>
			</table>
		);
	}
}

/**
 * CreditCardForm Component
 *
 * This component is a child component of UserBilling Component.
 * This component is used to display the credit card form from
 * the User Billing section of User Account, settings page.
 */
class CreditCardForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editMode: CFActionsStore.editMode,
			billingInfo: this.props.billingInfo
		};
	}

	addCreditCard() {
		let { name, number, cvc, exp } = this.getFieldsValue();
		let exp_month = exp.split('/')[0];
		let exp_year = exp.split('/')[1];
		let self = this;
		let billingInfo = self.state.billingInfo;

		if (!this.validateCC(Stripe, number, exp, cvc)) {
			alert('Incorrect Credit Card Info. Please Check');
			return;
		}

		Stripe.card.createToken({
			number,
			cvc,
			exp_month,
			exp_year
		}, (status, response) => {
			if (response.error) {
				alert('Something went wrong while creating token (Stipe)');
				return;
			}

			Parse.Cloud.run("addTokenToAccount", { 
				tokenId: response.id,
				accountId: this.props.account.id
			}).then(function(result) {
			    // make sure the set the enail sent flag on the object
			    console.log("result :" + JSON.stringify(result));
			    let cc = response.card;
				let defaultCard = false;
				let defaultLabel = !defaultCard ? 'set as default' : 'default';

				SettingsActions.updateBillingInfo({
					default: defaultCard,
					data: response,
					name
				});

				billingInfo.push({
					default: defaultCard,
					data: response,
					name
				});

				self.setState({ billingInfo });
				self.clearFields();
			}, function(error) {
			    // error
				alert('Something went wrong while creating token (cloud) ' + JSON.stringify(error));
				return;
			
			});
		});
	}

	clearFields() {
		['name', 'number', 'exp', 'cvc'].forEach(id => {
			document.getElementById(id).value = '';
		});
	}

	componentDidMount() {
		CFActionsStore.on('change', () => {
			this.setState({
				editMode: CFActionsStore.editMode
			});
		});
	}

	getFieldsValue() {
		let name = document.getElementById('name').value;
		let number = document.getElementById('number').value;
		let cvc = document.getElementById('cvc').value;
		let exp = document.getElementById('exp').value;

		return { name, number, cvc, exp };
	}

	validateCC(Stripe, number, exp, cvc) {
		let isValidCC = Stripe.card.validateCardNumber(number) &&
		Stripe.card.validateExpiry(exp) &&
		Stripe.card.validateCVC(cvc);

		if (!isValidCC) {
			return false;
		}

		return true;
	}

	render() {
		return(
			<div>
			<h4 className="form-title">Enter New Credit Card</h4>
			<form id="credit-card-form" className="form-group">
				<div className="form-group">
					<input
						type="text"
						id="name"
						className="form-control"
						placeholder="Name"
						disabled={this.state.editMode}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						id="number"
						className="form-control"
						placeholder="Credit Card Number"
						disabled={this.state.editMode}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						id="exp"
						className="form-control"
						placeholder="MM / YY"
						disabled={this.state.editMode}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						id="cvc"
						className="form-control"
						placeholder="CVC"
						disabled={this.state.editMode}
					/>
				</div>
				<button
					type="button"
					id="add-credit-card"
					className="btn btn-default"
					onClick={(e) => this.addCreditCard()}
					disabled={this.state.editMode}>Add</button>
			</form>
			<br />
			<h4 className="form-title">Credit Card Details</h4>
			<Table billingInfo={this.state.billingInfo} />
			</div>
		);
	}
}

/**
 * UserBilling Component
 *
 * This is the exposed component shared to the app.
 * This component is used to add credit cards for
 * user account billing information.
 *
 * This component is integrated on using the Stripe API.
 */
export default class UserBilling extends React.Component {
	constructor(props) {
		super(props);

		//let liveSecretKey = '';
		//let testSecretKey = ''; 
		let testPublishableKey = '';

		let livePublishableKey = '';

		Stripe.setPublishableKey(testPublishableKey);
	}

	render() {
		return <CreditCardForm account={this.props.account} billingInfo={
			this.props.account ? this.props.account.toJSON().billingInfo : null
		} />;
	}
}

