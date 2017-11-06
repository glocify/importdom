import React, { Component, PropTypes } from 'react';
import Wizard from './migrate-wizard/wizard-form';
import { connect } from 'react-redux';
import { migrateStore } from '../actions/actions-stores';
import { showLoading, showFeedback, hideFeedback } from '../actions/actions-feedback';
import { Link } from 'react-router';
import { PATH_ROOT } from '../routes';

class MigrateStorePage extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	handleSubmit = (values) => {

        this.props.showLoading( 'Your store domain is now being changed. You can navigate away from this page.' );

		const { id } = this.props.params;
		const data = { ...values, store_id: id } ;

		this.props.migrateStore( data )
		  .then( this.handleResponse );
	};

	handleResponse = ( action ) => {
        const { id } = this.props.params;
        const { status, data } = action.payload.data;

        if ( 'success' === status ) {
            this.context.router.push( PATH_ROOT + id + '/detail' );
            this.props.showFeedback( 'success', 'Your store domain was changed successfully.' )
        } else {
            this.props.showFeedback( 'error', data );
        }
    };

	render() {
		return <Wizard onSubmit={this.handleSubmit} />
	}
}

export default connect(null, { migrateStore, showLoading, showFeedback, hideFeedback })(MigrateStorePage);