import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { PATH_ROOT } from '../../routes';
import Feedback from '../feedback';
import { showModal } from '../../actions/actions-modals';
import CancelImportModal from '../modals/cancel-import';
import { showFeedback, showLoading, hideFeedback } from '../../actions/actions-feedback';
import { IMPORT_CANCEL } from '../../actions/actions-import';
import { fetchUserPackage } from '../../actions/actions-user-data';
import { importFilter, getImportStatus } from '../../utilities/store-filters';


class importStoreList extends Component {
	constructor(props) {
      super(props);
	}
	componentWillMount() {
		this.props.fetchUserPackage();
	};
	static contextTypes = {
		router: PropTypes.object
	};	
	onCancelClick( id ) {
		this.props.showModal( IMPORT_CANCEL, { id } );
	}
	render() {
		const { stores, user_package, user_data } = this.props;
		const importStores = typeof stores === 'object' ? stores.filter( importFilter ) : [];
		const packagetotal = user_package.packagetotal === 'undefined' ? '' : user_package.packagetotal;
		const activestores = user_package.activestores === 'undefined' ? '' : user_package.activestores;
		const upgrade = activestores >= packagetotal ? true : false;
		const fsb_id = user_data ? user_data.fsb_id : null;
		if ( 0 === importStores.length) {
			return <div className="jumbotron">
				<h2>You currently have no imported stores</h2>

				{upgrade === false && packagetotal > 0 ? <Link className="btn yellow" to={ PATH_ROOT + 'imports/new' }>Import Store</Link> : <div><p>You have no stores left on your account. Please upgrade your package.</p><Link className="btn green" to={"https://app.freshstoreinstant.com/upgrade"} >Upgrade</Link></div>}
			</div>
		}

		const mapToRow = stores => {

			const status = getImportStatus( stores );
			let visit = null;
			let details = null;
			let cancel = null;

			switch ( status.code ) {

				case 'imported':
					details = <Link className="btn green" to={ PATH_ROOT + 'imports/' + stores.id + '/detail' }>Continue</Link>
					cancel = <Link onClick={this.onCancelClick.bind( this, stores.id )} className="btn red">Cancel</Link>
					break;
				case 'in-progress':
					cancel = <Link onClick={this.onCancelClick.bind( this, stores.id )} className="btn red">Cancel</Link>
					break;	
				case 'migrated':
					visit = <a target="_blank" href={ 'http://' + stores.url }>Visit Store</a>
					details = <Link className="btn green" to={ PATH_ROOT + stores.id + '/detail' }>Manage Store</Link>
					break;

			}

			return <tr key={stores.id}>
				<td>{stores.id}</td>
				<td>{stores.url}</td>
				<td>{status.pretty}</td>
				<td>{stores.created}</td>
				<td>{visit}</td>
				<td>{details} {cancel}</td>
			</tr>
		};

		return <div>

		<div className="jumbotron">
            <h2>
                Here are the stores you've imported..
            </h2>
		</div>

		<table className="table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Importing From</th>
					<th>Import Status</th>
					<th>Created On</th>
					<th cols="2">Actions</th>
				</tr>
			</thead>
			<tbody>
			{ importStores.map( mapToRow ) }
			</tbody>
		</table>

		<Feedback />
		{upgrade === true ? <div><p>You have no stores left on your account. Please upgrade your package.</p><Link className="btn green" to={"https://app.freshstoreinstant.com/upgrade"} >Upgrade</Link></div> : <Link className="btn green" to={PATH_ROOT + 'imports/new'} >Import New Store</Link>}
        <Link className="btn grey pull-right" to={ PATH_ROOT }>Back to Dashboard</Link>
		<CancelImportModal />
	</div>
	}
}

const mapStateToProps = (state) => {
	const user_data = state.user.data ? state.user.data : [];
	return { stores: state.stores.imports, user_package: state.stores.user_package, user_data };
}

const mapDispatchToProps = { hideFeedback, showModal, showLoading, showFeedback, fetchUserPackage };

export default connect(mapStateToProps, mapDispatchToProps)(importStoreList);