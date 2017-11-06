import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { PATH_ROOT } from '../routes';
import { fetchUserData, fetchUserPackage } from '../actions/actions-user-data';

class Dashboard extends Component {
	constructor(props) {
      super(props);
	}
	componentWillMount() {
		this.props.fetchUserData();
	}
	render() {
		const { stores, user_package, user_data, attempts } = this.props;
		if(user_data.status_subscription == 'cancelled' || user_data.status_subscription == 'suspended' || user_data.status_subscription == 'refunded'){
			 return (
				<div className="jumbotron">
					<p>
						Your account is not active. Please <a rel={'external'} style={{color:'blue'}} href={'//app.freshstoreinstant.com/upgrade'}>click here</a> to upgrade.
					</p>
				</div>
			);
		}else{
			 return (
				<div className="jumbotron">
					<h2>
						Welcome to the Instant Store Manager.
					</h2>
					<p>
						From here you can create, move, backup your stores and manage your domains.
					</p>
					<Link className="btn yellow-casablanca" style={{marginRight:'15px'}} to={PATH_ROOT + 'create'}>Add New Store</Link>
					<Link className="btn green" style={{marginRight:'15px'}} to={PATH_ROOT + 'store-list'}>View Stores</Link>
					<Link className="btn blue-hoki" style={{marginRight:'15px'}} to={PATH_ROOT + 'domains'}>Domains</Link>
					<Link className="btn yellow-saffron" style={{marginRight:'15px'}} to={PATH_ROOT + 'blog'}>Request a Blog</Link>
					<Link className="btn purple" style={{marginRight:'15px'}} to={PATH_ROOT + 'imports/list'}>Import</Link>
				</div>
			);
		}
	}
}
const mapStateToProps = (state) => {
	const user_data = state.user.data ? state.user.data : [];
	return { user_package: state.stores.user_package, user_data };
}

const mapDispatchToProps = { fetchUserData, fetchUserPackage};

export default connect(mapStateToProps , mapDispatchToProps)(Dashboard);