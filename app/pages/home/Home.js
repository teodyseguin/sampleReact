import React from 'react';
import Parse from 'parse';
import Header from '../../shared/Header'; 
import HeaderStore from '../../stores/HeaderStore';
import * as HeaderActions from '../../actions/HeaderActions';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div>
			    <Header logo="../../../assets/img/Panda-No-Background.png" parentState={this} router={this.props.router} />

			    <div id="headerwrap">
				<div className="container">
				    <div className="row">
					<div className="col-lg-6">
					    <h1>Parse Servers-<br />
						Fully Build,<br/>
					    Root Access</h1>
					    <form className="form-inline" role="form">
						<a type="submit" className="btn btn-warning btn-lg" href="/dashboard">Get Started!</a>
					    </form>
					</div>
					<div className="col-lg-6">
					    <img className="img-responsive" src="assets/img/ipad-hand.png" alt="" />
					</div>
				    </div>
				</div>
			    </div>

			    <div className="container">
				<div className="row mt centered">
				    <div className="col-lg-6 col-lg-offset-3">
					<h1>Convenience and Control<br/>Sacrifice Nothing.</h1>
					<h3>We build your server, Then give you Root Access.</h3>
				    </div>
				</div>

				<div className="row mt centered">
				    <div className="col-lg-4">
					<img src="assets/img/ser01.png" width="180" alt="" />
					<h4>1 - Sign up</h4>
				    </div>

				    <div className="col-lg-4">
					<img src="assets/img/ser02.png" width="180" alt="" />
					<h4>2 - Sumbit a request for a server</h4>
				    </div>

				    <div className="col-lg-4">
					<img src="assets/img/ser03.png" width="180" alt="" />
					<h4>3 - Enjoy root access!</h4>
				    </div>
				</div>
			    </div>

			    <div className="container">
				<hr />
				<div className="row centered">
				    <div className="col-lg-6 col-lg-offset-3">
					<form className="form-inline" role="form">
					    <a type="submit" className="btn btn-warning btn-lg" href="/dashboard">Get Started!</a>
					</form>
				    </div>
				    <div className="col-lg-3"></div>
				</div>
				<hr />
			    </div>

			    <div className="container">
				<div className="row mt centered">
				    <div className="col-lg-6 col-lg-offset-3">
					<h1>Perfectly Scalable.</h1>
					<h3>When it's time for your servers to get bigger, your servers grow with the click of a button.</h3>
				    </div>
				</div>

				<div className="row mt centered">
				    <div className="col-lg-6 col-lg-offset-3">
					<div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
					    <ol className="carousel-indicators">
						<li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
						<li data-target="#carousel-example-generic" data-slide-to="1"></li>
						<li data-target="#carousel-example-generic" data-slide-to="2"></li>
					    </ol>

					    <div className="carousel-inner">
						<div className="item active">
						    <img src="assets/img/p01.png" alt="" />
						</div>
						<div className="item">
						    <img src="assets/img/p02.png" alt="" />
						</div>
						<div className="item">
						    <img src="assets/img/p03.png" alt="" />
						</div>
					    </div>
					</div>
				    </div>
				</div>
			    </div>

			    <div className="container">
				<hr />
				<div className="row centered">
				    <div className="col-lg-6 col-lg-offset-3">
					<form className="form-inline" role="form">
					    <a type="submit" className="btn btn-warning btn-lg" href="/dashboard">
							Get Started!
						</a>
					</form>
				    </div>
				    <div className="col-lg-3"></div>
				</div>
				<hr />
				<p className="centered">Copyright 2016 Pand Clouds LLC</p>
			    </div>

			</div>
		);
	}
}

