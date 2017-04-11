import React from 'react';

export class Authorized {
	static added(userType) {
		let userList = [];

		if (!$(`td[data-permission="${userType}"]`).length) {
			return [];
		}

		$(`td[data-permission="${userType}"]`).each(function() {
			userList.push($(this).text());
		});

		return userList;
	}

	static hasUsers(model, userType) {
		if (!model.hasOwnProperty(userType)) {
			return [];
		}
		else {
			return model[userType];
		}
	}

	static list(selected, type) {
		let html = [];
		let list = {
			Read: '',
			Write: '',
			Admin: ''
		};
		let permissionType = type;
		let selectedKey = '';

		if (!type) {
			permissionType = 'account-permission';
		}

		Object.keys(list).forEach(key => {
			if (key === selected) {
				list[key] = 'selected';
				selectedKey = key;
			}

			let classes = `permission ${list[key]} ${permissionType}`;

			html.push(<li key={key} className={classes}>{key}</li>);
		});

		return {
			struc: <div className="permissions"><ul>{html}</ul></div>,
			selectedKey,
		};
	}

	static reAssign(newPrivilege, previousPrivilege, element, dataProperty, modelObj) {
		let hasUsers = null;
		let permissionToUpdate = '.permissions .permission';
		let self = this;
		let selectorToFind = `td[${dataProperty}]`;
		let user = `tr[data-user="${$(element.currentTarget).parents('tr:first').attr('data-user')}"]`;
		let userValue = $(user).attr('data-user');
		let selectedAuthorized = {
			Admin: 'authorizedAdmins',
			Read: 'authorizedReaders',
			Write: 'authorizedWriters'
		};
		let model = modelObj.toJSON();

		if (!newPrivilege || !element.currentTarget || !dataProperty) {
			return;
		}

		if (!$(`td[${dataProperty}]`).length) {
			return;
		}

		$(user).find(permissionToUpdate).removeClass('selected');
		$(user).find(selectorToFind).attr(dataProperty, newPrivilege);
		element.currentTarget.className += ' selected';

		if (!modelObj) {
			return;
		}

		hasUsers = self.hasUsers(model, selectedAuthorized[newPrivilege]);

		// we need to remove the user from the previous permission array
		Object.keys(selectedAuthorized).forEach(key => {
			if (key === previousPrivilege) {
				let userIndex = model[selectedAuthorized[key]].indexOf(userValue);
				model[selectedAuthorized[key]].splice(userIndex, 1);

				modelObj.set(
					selectedAuthorized[key],
					model[selectedAuthorized[key]]
				);
			}
		});

		hasUsers.push(userValue);

		return {
			authorizedUser: selectedAuthorized[newPrivilege],
			hasUsers,
		};
	}

	static remove(user, permission, hidden, type, rem) {
		let classes = `remove-privileged ${type}`;

		if (!hidden) {
			classes = `remove-privileged hidden ${type}`;

			return <a
				href="javascript:;"
				id={user}
				className={classes}
				data-user={user}
				data-permission={permission}
				onClick={(e) => rem(e)}
			>
			<span>x</span></a>;
		}

		return <a
			href="javascript:;"
			id={user}
			className={classes}
			data-user={user}
			data-permission={permission}
			onClick={(e) => rem(e)}
		>
		<span>x</span></a>;
	}

	static users(model, type) {
		let authorized = {
			authorizedAdmins: {
				roleName: 'Admin'
			},
			authorizedWriters: {
				roleName: 'Write'
			},
			authorizedReaders: {
				roleName: 'Read'
			}
		};
		let html = '';
		let self = this;
		let userList = [];
		let permissionType = type;

		if (!type) {
			permissionType = 'account-permission';
		}

		Object.keys(authorized).forEach(key => {
			if (!model[key]) {
				return html;
			}

			let dataPermission = self.list(authorized[key].roleName, permissionType).selectedKey;
			let permissionList = self.list(authorized[key].roleName, permissionType).struc;
			userList = model[key];

			userList.forEach(user => {
				html += `<tr data-user="${user}">
				<td data-permission="${dataPermission}">${user}</td>
				<td>${permissionList}</td>
				<td>${self.remove(user, dataPermission, true, permissionType)}</td></tr>`;
			});
		});

		return html;
	}

	static verify(privilegedUser, parseObject) {
		let {
			authorizedAdmins,
			authorizedWriters,
			authorizedReaders
		} = parseObject;
		let foundMatch = 0;

		if (!privilegedUser) {
			return false;
		}

		if (_.indexOf(authorizedAdmins, privilegedUser) > -1 ||
			_.indexOf(authorizedWriters, privilegedUser) > -1 ||
			_.indexOf(authorizedReaders, privilegedUser) > -1) {

			foundMatch++;
		}

		return foundMatch === 0 ? true : false;
	}
}

