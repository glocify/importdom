import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { setStoreSelected, setStoreDeleted, fetchStores, UPGRADE_STORE, migrateStore, DELETE_STORE } from '../actions/actions-stores';
import { createArchive, fetchArchives } from '../actions/actions-archives';
import { showModal } from '../actions/actions-modals';
import { showLoading, showFeedback, hideFeedback } from '../actions/actions-feedback';
import DeleteStoreModal from './modals/delete-store';
import UpgradeStoreModal from './modals/upgrade-store';
import RestoreArchiveModal from './modals/restore-archive';
import Archives from './archives';
import Feedback from './feedback';
import { PATH_ROOT } from '../routes';
import compareVersions from 'compare-versions';
import LoginForm from './login-form';

class StoreDetailPage extends Component {

    constructor( props ) {
        super( props );
        this.archiveCreateSuccess = this.archiveCreateSuccess.bind( this );
    }

	componentWillMount() {
        this.props.fetchStores();
		this.props.setStoreSelected( this.props.params.id );
	}

    migrateSuccess( promise ) {
        const { status, text } = promise.payload.data;

        this.props.setStoreSelected( this.props.params.id )
            .then( this.props.showFeedback.bind( this, status, text ) );
    }

	onUpgradeClick( id ) {
		this.props.showModal( UPGRADE_STORE, { id } );
	}

	onDeleteClick( id ) {
		this.props.showModal( DELETE_STORE, { id } );
	}

	onCreateArchive( store_id ) {
		this.props.showLoading( 'Creating Backup Archive...');

		this.props.createArchive( store_id )
		  .then( this.archiveCreateSuccess.bind(this) );
	}

	archiveCreateSuccess( promise ) {
		const { status } = promise.payload.data;

        const success = 'Archive Created Successfully.';
        const fail = 'There was an error creating your backup, please contact support.';

        const message  = 'error' === status ? fail : success;

        if ( 'success' === status ) {
            this.props.fetchArchives();
        }

		this.props.showFeedback( status, message );
	}

	render() {

		if ( ! this.props.store ) {
			return <div>Loading...</div>;
		}

		const { store, deleted } = this.props;
		const { id, url, storeversion, status_queue } = store;
		const store_delete = deleted.indexOf(id) >= 0 ? true : false;
		const folder = store.folder ? '/' + store.folder : '';
		let upgrade = <p style={{marginTop:'20px'}}>
			<span>Version: {storeversion} - Your store is on the latest version.</span>
		</p>

        const latestVersion = window.fsbVersion.trim();

		if(store.update_status == 1){
			return <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="jumbotron">
                            <h2 style={{marginTop:'0px'}}>{url + folder}</h2>
                            <br />
							This store is currently being upgraded to the latest version. When the upgrade is complete the store options will be available here again.
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <Feedback />
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <Link className="btn grey pull-right" to={ PATH_ROOT + 'store-list' }>Back to Store List</Link>
                    </div>
			</div>;
		} else if ( 1 === compareVersions( latestVersion, storeversion.trim() ) ) {
			upgrade = <button style={{marginRight:'15px'}}
                              onClick={this.onUpgradeClick.bind(this, id)}
                              className="btn green">Upgrade to v{latestVersion}</button>;
		}
		if(status_queue == 'deleting' || store_delete){
			return <div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="jumbotron">
								<h2 style={{marginTop:'0px'}}>{url + folder}</h2>
								<br />
							</div>
						</div>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<Feedback />
						</div>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<Link className="btn grey pull-right" to={ PATH_ROOT + 'store-list' }>Back to Store List</Link>
						</div>
			</div>
		}else{
			return <div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="jumbotron">
								<h2 style={{marginTop:'0px'}}>{url + folder}</h2>
								<br />
								<LoginForm {...store} />
								<Link target="_blank" style={{marginRight:'15px'}} to={ 'http://' + url + folder } className="btn yellow-casablanca">Visit</Link>
								<button style={{marginRight:'15px'}} className="btn yellow" onClick={this.onCreateArchive.bind(this, id)}>Create Backup Archive</button>
								<Link style={{marginRight:'15px'}} to={ PATH_ROOT + id + '/change-domain'} className="btn blue-hoki">Change Domain</Link>
								<button className="btn red pull-right" style={{marginRight:'15px'}} onClick={this.onDeleteClick.bind(this, id)}>Delete</button>

								{upgrade}



							</div>
						</div>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<Archives store_id={id} />
						</div>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<Feedback />
						</div>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<Link className="btn grey pull-right" to={ PATH_ROOT + 'store-list' }>Back to Store List</Link>
						</div>

						  <DeleteStoreModal />
						  <UpgradeStoreModal />
						  <RestoreArchiveModal />

			</div>
		}
	}
}

const mapStateToProps = (state) => {
    const matchId = store => {
        return parseInt(state.stores.selected) === parseInt(store.id);
    };
	const deleted = state.stores.deleted;
	return { store: state.stores.all.find( matchId ), deleted : deleted};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setStoreSelected,
		setStoreDeleted,
		showModal,
		showFeedback,
		showLoading,
		createArchive,
        migrateStore,
        fetchStores,
        hideFeedback,
        fetchArchives

	}, dispatch);
};

export default connect( mapStateToProps, mapDispatchToProps )(StoreDetailPage);