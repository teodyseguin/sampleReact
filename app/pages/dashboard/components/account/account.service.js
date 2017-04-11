import React from 'react';
import { Link } from 'react-router';

export let AccountService = (function() {
	'use strict';

	let _activeAccount = null;
	let _accounts = null;

	class AccountServiceClass {
			static accounts(parse, options, callback) {
				if (!parse.User || !parse.User.current() || !parse.Object || !parse.Query) {
					return callback({ message: 'Not a valid Parse Object' });
				}

				let valueToSearch = parse.User.current().id;
				let Account = parse.Object.extend('Account');
				let query = new parse.Query(Account);
				let fieldToSearch = 'ownerPFObjectID';

				if (options && options.search && Object.keys(options.search).length) {
					if (Object.keys(options.search)[0] !== 'field' || Object.keys(options.search)[1] !== 'value') {
						return callback({ message: 'Not a valid option' });
					}

					fieldToSearch = options.search.field;
					valueToSearch = options.search.value;
				}

				query.equalTo(fieldToSearch, valueToSearch);
				query.find({
					success(results) {
						return callback(null, results);
					},
					error(error) {
						return callback(error);
					}
				});
			}

			/**
			 * Create a list of accounts and attach this
			 * to the menu dropdown
			 *
			 * @param accounts
			 * 	Is an array of objects of type Account
			 *
			 * @return
			 * 	a <ul> DOM that lists all associated accounts
			 * 	to a particular user
			 */
			static accountList(accounts) {
				let list = [];

				if (accounts.length) {
					accounts.forEach(key => {
						let accountID = key.id;
						let accountName = key.toJSON().accountName;
						let href = `/dashboard/account/${accountID}`;
						list.push(<li key={key.id}><Link to={href} className="account-item">{accountName}</Link></li>);
					});
				}

				return <ul>{list}</ul>;
			}

			/**
			 * Return's data being wrapped in a literal object
			 *
			 * @params accounts
			 * 	An object of type account containing details and information
			 * 	of a certain user account
			 *
			 * @param user
			 * 	A Parse User object obtained by Parse.User.current()
			 *
			 * @return
			 * 	A literal object containing details
			 */
			static accountWrapper(accounts, user) {
				let accountToDisplay = null;
				let activeAccountID = null;
				let activeAccount = null;
				let accountList = null;
				let accountServers = null;
				let thumbnail = null;

				if (accounts.length) {
					accountToDisplay = accounts[0].toJSON().accountName;
					activeAccount = accounts[0];
					activeAccountID = accounts[0].id;
					accountList = this.accountList(accounts);
					thumbnail = accounts[0].toJSON().photo && accounts[0].toJSON().photo.url || null;
				}

				return {
					accounts,
					accountToDisplay,
					accountList,
					activeAccount,
					activeAccountID,
					accountServers,
					thumbnail,
					user
				};
			}

			/**
			 * cache the accounts of a user
			 *
			 * @param accounts
			 * 	an array of Account object
			 */
			static setAccounts(accounts) {
				_accounts = accounts;
			}

			/**
			 * cache the current active account
			 *
			 * @param account
			 * 	and object of type Account containing details
			 * 	about the user's account
			 */
			static setActive(account) {
				_activeAccount = account;
			}

			/**
			 * retrieve the previously cached active account
			 *
			 * @return
			 * 	Account object
			 */
			static getActive() {
				return _activeAccount;
			}

			/**
			 * retrieve the previously cached accounts array
			 *
			 * @return
			 * 	array of Account object
			 */
			static getAccounts() {
				return _accounts;
			}
	}

	return AccountServiceClass;
})()

