import React, { Component, PropTypes } from 'react';
import Wizard from './store-wizard/wizard';
import { connect } from 'react-redux';
import { addNewStore, fetchStores, availableDomains } from '../actions/actions-stores';
import { fetch10SecondStores } from '../actions/actions-10ss';
import { fetchUserData, fetchUserPackage } from '../actions/actions-user-data';
import { showFeedback, showLoading, hideFeedback } from '../actions/actions-feedback';
import { createStoreSuccess } from '../actions/actions-forms';
import { PATH_ROOT } from '../routes';
import { buildDomain } from '../utilities/domains';

class StoreNewPage extends Component {
	constructor(props) {
      super(props);
	  this.state ={
		store_values: null
		}
	}
	static contextTypes = {
		router: PropTypes.object
	};

	componentWillMount() {
        this.props.fetchUserData();
    }
	handleSubmit = values => {
        this.props.showLoading( 'Please wait while we begin your store setup…' );
		this.setState({store_values: values});
		this.props.fetchUserPackage().then(this.checkPackage);
		
	};
	checkPackage = (response) => {
		const user_package = response.payload.data.data;
		const {packageinfoFSI} = response.payload.data.data;
		if(packageinfoFSI.activestores < packageinfoFSI.packagetotal)
			this.props.availableDomains().then(this.availbledomain);
		else
			this.props.showFeedback( 'error', 'Your Store limit has been reached.');	
	};
	availbledomain = (response) => {
		this.state.store_values.availabledomain = response.payload.data.data;
		this.props.fetchStores().then(this.checkStore);
	}
	checkStore = ( action ) => {
		if ( 'success' === action.payload.data.status ) {
			const data = typeof action.payload.data.data === 'string' ? [] : action.payload.data.data;
			const store_domians = data.map( ( storeRecord ) => {
				const {type, url, created, status, failures} = storeRecord;
				if( type == 2 && created != '0000-00-00 00:00:00' && status == 1){
					return url;
				}	
				return false
			}, this);
			var domain = this.state.store_values.domain;
			if(undefined !== this.state.store_values.subdomain){
				domain =  this.state.store_values.subdomain + '.' + this.state.store_values.domain;
			}
			this.props.addNewStore( this.state.store_values ).then( this.handleResponse );
		}else{
			this.props.showFeedback( 'error', 'Something went wrong. Please try again later.');
		}
	}
	not(full_domain, store_domains) {
		for(var i=0;i<store_domains.length;i++) {
		  if(full_domain === store_domains[i]){return true;}
		}
		return false;
	}	
    handleResponse = ( action ) => {
        if ( 'success' === action.payload.data.status ) {
            this.props.showFeedback( 'success', 'Your new store was created.');
            this.props.createStoreSuccess();
            this.context.router.push( PATH_ROOT + 'store-list' );
        } else {
            this.props.showFeedback( 'error', action.payload.data.data );
        }
    };

	render() {
		return <Wizard onSubmit={this.handleSubmit} />
	}
}

export default connect( null, { addNewStore, fetchUserPackage, fetchStores, availableDomains, buildDomain, fetch10SecondStores, fetchUserData, hideFeedback, showLoading, showFeedback, createStoreSuccess })(StoreNewPage);