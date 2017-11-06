import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { fetchStores, deleteStore, setStoreDeleted, upgradeStore, fetchStoreTemplates, DELETE_STORE, STORE_PROCESS_CANCEL } from '../actions/actions-stores';
import { updateMessage } from '../actions/actions-index';
import { showModal } from '../actions/actions-modals';
import CancelStoreModal from './modals/cancel-store';
import { showLoading, showFeedback, hideFeedback } from '../actions/actions-feedback';
import { fetchUserData, fetchUserPackage } from '../actions/actions-user-data';
import { Link } from 'react-router';
import Feedback from './feedback';
import compareVersions from 'compare-versions';
import { PATH_ROOT } from '../routes';
import LoginForm from './login-form';

class StoreList extends Component {
	constructor(props) {
      super(props);
	}
	componentWillMount() {
		this.props.fetchStores();
		this.props.fetchUserData();
		this.props.fetchUserPackage();
	}
	onCancelClick( id ) {
		this.props.showModal( STORE_PROCESS_CANCEL, { id } );
	}
    getStoreStatus( store, deleted_list = [] ) {

        const { storeversion, failures, created, deleted, locked, type, status_migration, migrated } = store;
        const pending = created === '0000-00-00 00:00:00';
        const alive = deleted === '0000-00-00 00:00:00';
        const isLocked = '0000-00-00 00:00:00' !== locked;
        const pendingImport = 4 === parseInt( type );
        const migrating = migrated !== '0000-00-00 00:00:00' && status_migration === null;
		const delete_store = deleted_list.indexOf(store.id) >= 0 ? true : false;

        if ( ! alive ) {
            return {
                status: 'deleted',
				display: false
            }
        }
		else if ( ! pending && store.update_status == 1 && parseInt(failures) < 10){
            return {
                status:'upgrading',
                message: 'Upgrading',
                actions: [
                        <Link key="detail" className="btn blue-hoki" to={ PATH_ROOT + store.id + '/detail'}>Options</Link>
                ],
				display: true
            };			
		}		
        else if ( migrating && parseInt(failures) > 9) {
            return {
                status: 'migrating',
                display: true,
                message: 'Store Migration Failed',
                actions: [
                    <Link className="open-intercom btn red" to={"mailto:aszvr3rs@incoming.intercom.io"}>Open Support</Link>,
                    <Link onClick={this.onCancelClick.bind( this, store.id )} className="btn red-thunderbird">Cancel</Link>
                ]
            }
        }
        else if ( migrating ) {
            return {
                status: 'migrating',
                display: true,
                message: 'Store Migration in Process',
                actions: null
            }
        }
        else if ( isLocked ) {
            return {
            	status: 'locked',
				display: false
            }
        }
		else if ( pendingImport ) {
			return { status: 'pending-import', display: false }
		}
        else if ( 10 === parseInt(failures) ) {
            return {
                status: 'failed',
                message: 'Store Creation Failed',
				display: true,
                actions: [
                    <Link className="open-intercom btn red" to={"mailto:aszvr3rs@incoming.intercom.io"}>Open Support</Link>,
                    <Link onClick={this.onCancelClick.bind( this, store.id )} className="btn red-thunderbird">Cancel</Link>
                ]
            };
		} else if( parseInt(failures) > 0 && '1' === store.status_databasic ) {
            return {
                status:'pending',
                message: 'Pending',
                actions: [
                        <Link key="detail" className="btn blue-hoki" to={ PATH_ROOT + store.id + '/detail'}>Options</Link>
                ],
				display: true
            };		
        } else if( parseInt(failures) > 0 ) {
            return {
                status:'pending',
                message: 'Finishing up.. almost done!',
                actions: null,
				display: true,
				nostoreurl: true
            };
        } else if( store.domain !== 'none' && null === store.dchange_status ) {
            return {
                status:'pending',
                message: 'Creating store, please wait',
				display: true,
                actions: null,
				nostoreurl: true
            };
        } else if( pending ) {
            return {
                status:'pending',
                message: 'Your store is in the queue to be built, this shouldn\'t take more than a minute and will show here automatically.',
				display: true,
                actions: null
			};
		} else if(delete_store) {
            return {
                status:'deleting',
                message: 'Deleting store, please wait',
				display: true,
                actions: <Link key="detail" className="btn blue-hoki" to={ PATH_ROOT + store.id + '/detail'}>Options</Link>
			};			
        } else {
            return {
                status: 'active',
                message: 'Active',
                version: storeversion,
				display: true,
                actions: [
                    <LoginForm key={store.id} {...store} />,
                    <Link key="detail" className="btn blue-hoki" to={ PATH_ROOT + store.id + '/detail'}>Options</Link>
                ]
            }
        }
    }

    /**
     * If there are stores pending, fetch the stores again every 5 seconds.
     */
    handleTimeout( stores, deleted_list ) {
        let pending = false;

        for ( const store of stores ) {
            const storeDetails = this.getStoreStatus(store, deleted_list);
            if ( 'pending' === storeDetails.status ) {
               pending = true;
            }
        }
        if ( pending ) {
            setTimeout( this.props.fetchStores, 5000 );
        }
    }

	render() {
		const { stores, user_package, user_data, attempts, deleted_list } = this.props;
		
		const packagetotal = user_package.packagetotal === 'undefined' ? user_package.packagetotal : user_package.packagetotal;
		const activestores = user_package.activestores === 'undefined' ? user_package.activestores : user_package.activestores;
		const fsb_id = user_data ? user_data.fsb_id : null;
		const latestVersion = window.fsbVersion.trim();
		
		if(typeof user_data.status_subscription === 'undefined'){
			return <h3>Please wait a moment while we load your stores...</h3>;
		}else if( user_data.status_subscription == 'cancelled' || user_data.status_subscription == 'suspended' || user_data.status_subscription == 'refunded'){
			 return (
				<div className="jumbotron">
					<p>
						Your account is not active. Please <a rel={'external'} style={{color:'blue'}} href={'//app.freshstoreinstant.com/upgrade'}>click here</a> to upgrade.
					</p>
				</div>
			);
		}else{
			this.handleTimeout( stores );
			if ( 0 === attempts && 0 === stores.length ) {
				return <h3>Please wait a moment while we load your stores...</h3>;
			}else if (0 === stores.length){
				return <div>
					<div className="total_store row no-margin">
						<div className="col-md-4"><strong>Total Stores in your plan: </strong>{packagetotal}</div>
						<div className="col-md-3"><strong>Active Stores: </strong>{activestores}</div>
						<div className="col-md-3"><strong>Available Stores: </strong>{packagetotal - activestores}</div>
						<div className="col-md-2"><a className="btn green" href={"https://app.freshstoreinstant.com/upgrade"}>Upgrade</a></div>
					</div>
					<hr/>
					<div className="col-md-12">
						<p>You have not created any stores yet.</p>
						<br />
						<br />

						<Link className="btn green" style={{marginRight:'15px'}} to={ PATH_ROOT + 'create' }>Add Store</Link>
						<Link className="btn grey pull-right" to={ PATH_ROOT }>Back to Dashboard</Link>

						<br />
						<Feedback />					
					</div>
				</div>
			}
			const store_list = stores.map( ( store ) => {
				const { id, url, name, created, storeversion } = store;
				const storeDetails = this.getStoreStatus(store, deleted_list);
				const pending = storeDetails.status === 'pending';
				const failed = storeDetails.status === 'failed';
				const folder = store.folder ? '/'+store.folder : '';
				const storeUrl = storeDetails.nostoreurl == true ? <div style={{textAlign:'center'}}>-</div> : <a href={'http://' + url + folder} target="_blank">{ url + folder }</a>;
				if ( ! storeversion ) {
				   return null;
				}
				const store_version = compareVersions( latestVersion, storeversion.trim() ) === 1 ? <p>{storeversion} <Link key="detail" className="btn blue-hoki" to={ PATH_ROOT + id + '/detail'}>Upgrade</Link></p> : storeversion;
				if ( ! storeDetails.display ) {
					return null;
				}
				return <tr key={store.id}>
					<td>{id}</td>
					<td>{name}</td>
					<td className="lead">{storeUrl}</td>
					<td>{storeDetails.message}</td>
					<td>{created}</td>
					<td>{storeDetails.status === 'upgrading' ? '' : storeversion}</td>
					<td>{storeDetails.actions}</td>
				</tr>;
			}, this);
			return <div>
				<div className="total_store row no-margin">
					<div className="col-md-4"><strong>Total Stores in your plan: </strong>{packagetotal}</div>
					<div className="col-md-3"><strong>Active Stores: </strong>{activestores}</div>
					<div className="col-md-3"><strong>Available Stores: </strong>{packagetotal - activestores}</div>
					<div className="col-md-2"><a className="btn green" href={"https://app.freshstoreinstant.com/upgrade"}>Upgrade</a></div>
				</div>
				<hr/>
				<div className="table-responsive">
					<table className="table font-medium">
						<thead>
							<tr>
								<th>ID</th>
								<th>Store Name</th>
								<th>URL</th>
								<th>Status</th>
								<th>Store created</th>
								<th>Version</th>
								<th>Actions...</th>
							</tr>
						</thead>
						<tbody>
							{store_list}
						</tbody>
					</table>
				</div>

				<br />
				<br />

				<Link className="btn green" style={{marginRight:'15px'}} to={ PATH_ROOT + 'create' }>Add Store</Link>
				<Link className="btn grey pull-right" to={ PATH_ROOT }>Back to Dashboard</Link>

				<br />
				<CancelStoreModal />
				<Feedback />

			</div>
		}
	}
}

const mapStateToProps = (state) => {
	const user_data = state.user.data ? state.user.data : [];
	return { stores: state.stores.all, user_package: state.stores.user_package, user_data, attempts: state.stores.attempts, deleted_list: state.stores.deleted };
}

const mapDispatchToProps = { fetchStoreTemplates, setStoreDeleted, fetchUserData, fetchUserPackage, showFeedback, showLoading, showModal, fetchStores, deleteStore, upgradeStore, updateMessage };

export default connect(mapStateToProps, mapDispatchToProps)(StoreList);