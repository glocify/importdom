import React, { Component } from 'react';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import validate from './validate';
import { buildDomain } from '../../utilities/domains';
import { fetchStoreById } from '../../utilities/10ss';
import Feedback from '../feedback';

class ConfirmPage extends Component {

	renderTenSecondStoreInfo( ten_second_store ) {

		let template_message = '';

		if ( undefined === ten_second_store ) {
			template_message = 'A new empty store';
		} else {
			template_message = 'A new store using the template \'' + ten_second_store + "'";
		}

		return <h3 className="text-center">{template_message} will be created at</h3>
	}

	render() {
		const { handleSubmit, pristine, previousPage, submitting } = this.props;
		const { ten_second_store, domain } = this.props.form_values;
        const url = 'http://' + domain;
		return <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <form onSubmit={handleSubmit}>
                    <div className="jumbotron">
                        {this.renderTenSecondStoreInfo(ten_second_store)}
                        <h2 style={{marginBottom:"100px"}} className="text-center">{url}</h2>
                    </div>

                    <button type="button" className="previous btn dark-grey pull-left" onClick={previousPage}>Previous</button>
                    <button type="submit" className="btn btn-lg btn-primary green pull-right" disabled={pristine || submitting}>Make my Store!</button>
                </form>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <Feedback />
            </div>
		</div>
	}
}

let confirm_page = reduxForm({
	form: 'wizard',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate
})(ConfirmPage);

const mapStateToProps = (state) => {
	const selector = formValueSelector('wizard');
    const storeId = selector( state, 'ten_second_store' );
    const domain = selector( state, 'domain' );
    const subdomain = selector( state, 'subdomain' );
    const store = fetchStoreById( state.ten_second_stores.flat, storeId );

	return { form_values: {
		ten_second_store: storeId ? store.name : storeId,
        domain: buildDomain( domain, subdomain )
	} };
};

confirm_page = connect( mapStateToProps, {} )(confirm_page);

export default confirm_page;