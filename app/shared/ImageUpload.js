import React from 'react';
import Parse from 'parse';
import CFActionsStore from '../stores/CFActionsStore';
import ImageUploadStore from '../stores/ImageUploadStore';
import * as ImageUploadActions from '../actions/ImageUploadActions';

/**
 * Upload Component
 *
 * This component is a child component of ImageUpload Component.
 *
 * The main purpose of this compnent is to wrap the image upload
 * trigger button. The upload trigger button is kept hidden. It
 * is kept hidden for design purpose only.
 */
class Upload extends React.Component {
	constructor(props) {
		super(props);
		this.files = null;
	}

	selectFiles(e) {
		let files = e.target.files || e.dataTransfer.files;
		let uploadButton = document.getElementById('upload');

		this.files = files[0];

		if (uploadButton.onclick) {
			uploadButton.onclick();
		}
		else {
			uploadButton.click();
		}
	}

	uploadFiles(e) {
		let parseFile = new Parse.File(this.files.name, this.files);
		let progress = document.getElementsByTagName('progress');

		this.props.IUState.setState({
			parseFile
		});

		progress[0].style.display = 'block';

		parseFile.save().then(() => {
			progress[0].style.display = 'none';
			ImageUploadActions.updateUpload(parseFile);

			this.props.IUState.setState({
				imageSource: parseFile._url
			});
		},
		(error) => {
			alert('A problem occur while uploading photo');
		});
	}

	render() {
		let disabled = !this.props.IUState.state.editMode ? true : false;

		return(
			<div className="form-group">
				<label className="left-text">
					Image Upload
					<input
						type="file"
						name="fileselect"
						id="fileselect"
						className="form-control"
						onChange={(e) => this.selectFiles(e)}
						disabled={disabled}
					/>
				</label>
				<input
					id="upload"
					type="button"
					value="Upload"
					className="btn btn-default"
					onClick={(e) => this.uploadFiles(e)}
					disabled={disabled}
				/>
			</div>
		);
	}
}

/**
 * ImagePlaceholder Component
 *
 * This component if a child component of ImageUpload Component.
 * Use to display a figure element for containing the image element
 * and the figure caption element.
 */
class ImagePlaceholder extends React.Component {
	constructor(props) {
		super(props);
	}

	imageClicked() {
		if (!this.props.IUState.state.editMode) {
			return;
		}

		let fileSelectButton = document.getElementById('fileselect');	

		if (fileSelectButton.onclick) {
			fileSelectButton.onclick();
		}
		else {
			fileSelectButton.click();
		}
	}

	removeUpladedPhoto() {
		ImageUploadActions.updateUpload(null);
	}

	render() {
		let classes = this.props.IUState.state.imageSource ? 'upload-photo with-photo' : 'upload-photo';
		classes += CFActionsStore.editMode ? ' editable' : '';

		return(
			<figure id="photo-figure" className={classes}>
				<span
					className="glyphicon glyphicon-remove remove-uploaded-photo"
					aria-hidden="true" onClick={(e) => this.removeUpladedPhoto()}
				></span>
				<img
					src={this.props.IUState.state.imageSource}
					className="user-photo"
					onClick={(e) => this.imageClicked(e)}
				/>
				<figcaption onClick={(e) => this.imageClicked(e)}>Upload image</figcaption>
			</figure>
		);
	}
}

/**
 * Progress Component
 *
 * This component is a child component of ImageUpload Component
 * Use to display a progress bar fro when the upload is triggered.
 */
class Progress extends React.Component {
	render() {
		return <progress></progress>;
	}
}

export default class ImageUpload extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editMode: CFActionsStore.editMode,
			imageSource: this.props.photo,
			parseFile: null
		}

		this.updateEditMode = this.updateEditMode.bind(this);
		this.updateImageSource = this.updateImageSource.bind(this);
	}

	componentDidMount() {
		CFActionsStore.on('change', this.updateEditMode);
		ImageUploadStore.on('change', this.updateImageSource);
	}

	componentWillUnmount() {
		CFActionsStore.removeListener('change', this.updateEditMode);
		ImageUploadStore.removeListener('change', this.updateImageSource);
	}

	render() {
		return(
			<div className="image-upload">
				<ImagePlaceholder IUState={this} />
				<Progress />
				<Upload IUState={this} />
			</div>
		);
	}

	updateEditMode() {
		this.setState({
			editMode: CFActionsStore.editMode
		});
	}

	updateImageSource() {
		this.setState({
			imageSource: ImageUploadStore.upload
		});
	}
}

