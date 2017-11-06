import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { showFeedback, showLoading, hideFeedback } from '../actions/actions-feedback';
import { fetchStores } from '../actions/actions-stores';
import { reduxForm, Field } from 'redux-form';
import ImportList from './import/list';
import ImportNew from './import/new';
import ImportDetail from './import/detail';
import { importStore, setImportSelected, importStoreSuccess, importMigrate } from '../actions/actions-import';
import { fetchUserData } from '../actions/actions-user-data';
import { Link } from 'react-router';
import { PATH_ROOT } from '../routes';
import { importsArePending } from '../utilities/store-filters';

class ImportPage extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

    componentWillMount() {
		this.props.fetchUserData();
        this.props.fetchStores();
    }

	componentWillReceiveProps( nextProps ) {
    	this.props.setImportSelected( nextProps.params.id );
	}

    validate = ( props ) => {
		this.props.showLoading( 'Checking store...' );

        this.props.importStore( props )
		  .then( this.handleValidateResponse );
    };

    handleValidateResponse = ( action ) => {
      const { status, data } = action.payload.data;

      if ( 'success' === status ) {
		  this.props.showFeedback( 'success', 'Store Details Validated. This store is available for importing.' );
		  this.props.fetchStores().then( () => { this.context.router.push( PATH_ROOT + 'imports/' + data + '/detail' ) } );
	  } else {
		  this.props.showFeedback( status, data );
	  }
    };

    migrate = ( id ) => {
		this.props.showLoading( 'Importing your store...' );
    	this.props.importMigrate( id )
		  .then( this.handleMigrateResponse );
	};

    handleMigrateResponse = ( action ) => {

		const { status, data } = action.payload.data;

		if ( 'success' === status ) {
			this.props.showFeedback( 'success', 'Store import has begun.' );
			this.context.router.push( PATH_ROOT + 'imports/list' );
			this.props.fetchStores().then( () => { this.context.router.push( PATH_ROOT + 'imports/list' ) } );
		} else {
			this.props.showFeedback( status, data );
		}

	};

    handleTimeout() {
		const { stores } = this.props;

    	if ( importsArePending( stores ) ) {
    		console.log('set timeout');
			setTimeout( this.props.fetchStores, 5000 );
		}
	}

    render() {
		this.handleTimeout();
        const { stores, storeSelected ,user_data} = this.props;
		if(typeof user_data.status_subscription === 'undefined'){
			return <h3>Please wait...</h3>;
		}else if( user_data.status_subscription == 'cancelled' || user_data.status_subscription == 'suspended' || user_data.status_subscription == 'refunded'){
			 return (
				<div className="jumbotron">
					<p>
						Your account is not active. Please <a rel={'external'} style={{color:'blue'}} href={'//app.freshstoreinstant.com/upgrade'}>click here</a> to upgrade.
					</p>
				</div>
			);
		}else{
			const { page } = this.props.route;

			switch ( page ) {
				case 'list':
					return <ImportList stores={stores} />

				case 'new':
					return <ImportNew onSubmit={ this.validate } />

				case 'detail':
					return <ImportDetail store={storeSelected} migrate={this.migrate} />
			}

			return null;
		}
    }
}

const mapStateToProps = ( state ) => {

	const matchId = store => {
		return parseInt(state.imports.selected) === parseInt(store.id);
	};
	const user_data = state.user.data ? state.user.data : [];
    return { stores: state.stores.imports, storeSelected: state.stores.all.find( matchId ),user_data };
};

const mapDispatchToProps = { showFeedback, showLoading, hideFeedback, fetchStores, fetchUserData,
	importStore, importStoreSuccess, setImportSelected, importMigrate };

export default connect( mapStateToProps, mapDispatchToProps )( ImportPage );