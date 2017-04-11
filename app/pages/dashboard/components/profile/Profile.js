import React from 'react';
import Parse from 'parse';
import Spinner from '../../../../shared/Spinner';
import CFActions from '../../../../shared/CFActions';
import ImageUpload from '../../../../shared/ImageUpload';
import ImageUploadStore from '../../../../stores/ImageUploadStore';
import CentralDataStore from '../../../../stores/CentralDataStore';
import * as CentralDataActions from '../../../../actions/CentralDataActions';

/**
 * ProfileForm Component
 *
 * This component is a child component of Article Component
 * Use to display the Profile form which contains the user's
 * profile information.
 */
class ProfileForm extends React.Component {
	constructor(props) {
		super(props);
	}

	handleChangeEvent(e) {
		let value = e.target.value;
		let profile = this.props.profile.state.profile;

		switch(e.currentTarget.id) {
			case 'first-name':
				profile.firstName = value;
				this.props.profile.setState({profile});
				break;

			case 'last-name':
				profile.lastName = value;
				this.props.profile.setState({profile});
				break;

			case 'email':
				profile.email = value;
				this.props.profile.setState({profile});
				break;

			case 'user-name' :
				profile.username = value;
				this.props.profile.setState({profile});
				break;
		}
	}

	render() {
		let profile = this.props.profile.state.profile;

		return(
			<form id="user-account-form">
			<div className="form-group">
				<label>First Name:</label>
				<input
					type="text"
					id="first-name"
					className="form-control"
					placeholder="e.g. John"
					value={profile.firstName && profile.firstName || ''}
					onChange={(e) => this.handleChangeEvent(e)}
					disabled
				/>
			</div>
			<div className="form-group">
				<label>Last Name:</label>
				<input
					type="text"
					id="last-name"
					className="form-control"
					placeholder="e.g. Meyer"
					value={profile.lastName && profile.lastName || ''}
					onChange={(e) => this.handleChangeEvent(e)}
					disabled="true"
				/>
			</div>
			<div className="form-group">
				<label>Username:</label>
				<input
					type="text"
					id="user-name"
					className="form-control"
					placeholder="e.g. johnmeyer"
					value={profile.username && profile.username || ''}
					onChange={(e) => this.handleChangeEvent(e)}
					disabled="true"
				/>
			</div>
			<div className="form-group">
				<label>E-mail:</label>
				<input
					type="text"
					id="email"
					className="form-control"
					placeholder="e.g. johnmeyer@gmail.com"
					value={profile.email && profile.email || ''}
					onChange={(e) => this.handleChangeEvent(e)}
					disabled="true"
				/>
			</div>
			</form>
		);
	}
}

/**
 * Article Component
 *
 * This component is a child component of Profile Component.
 * The main purpose of this component is to contain/wrap the
 * ProfileForm component and some other elements from the
 * profile page.
 */
class Article extends React.Component {
	constructor(props) {
		super(props);
	}

	save() {
		let user = Parse.User.current();

		user.save(this.props.profile.state.profile, {
			success(user) {
				alert('Profile is updated successfully');
			},
			error(user, error) {
				throw new Error(error.message);
			}
		});
	}

	render() {
		let fields = [
			'first-name',
			'last-name',
			'user-name',
			'email',
			'upload'
		];
		let photo = this.props.profile.state.profile.photo && this.props.profile.state.profile.photo.url || null;

		return(
			<article>
				<header>
					<CFActions
						classes="server-details-actions"
						fields={fields}
						save={(e) => this.save()}
						router={this.props.router}
					 />
					<ImageUpload
						photo={photo}
					/>
				</header>		
				<ProfileForm
					profile={this.props.profile}
					parentState={this.props.parentState}
				/>
			</article>
		);
	}
}

export default class Profile extends React.Component {
	constructor(props) {
		super(props);

		let user = Parse.User.current().toJSON();

		this.state = {
			profile: {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				username: user.username,
				photo: user.photo
			}
		}
	}

	componentDidMount() {
		ImageUploadStore.on('change', () => {
			let profile = this.state.profile;
			profile.photo = ImageUploadStore.upload;

			this.setState({
				profile
			});
		});
	}

	render() {
		return(
			<section id="profile-section">
				<Spinner />
				<Article
					profile={this}
					parentState={this.props.parentState}
					router={this.props.router}
				/>
			</section>
		);
	}
}

