import React, { Component } from 'react';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
// import validate from './validate';

class ConfirmPage extends Component {

	render() {
		const { handleSubmit, pristine, previousPage, submitting } = this.props;
		const { domain, subdomain } = this.props.form_values;
        const full_domain = subdomain ? subdomain + '.' + domain : domain;

		return (
		  <form onSubmit={handleSubmit}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="jumbotron">
				  <h2 className="text-center">Your store will be moved to</h2>
				  <h2 className="text-center">http://{ full_domain }</h2>
				  <button type="submit" className="btn green pull-right" disabled={pristine || submitting}>Submit</button>
				  <button type="button" className="previous btn grey pull-left" onClick={previousPage}>Previous</button>
			  </div></div>
		  </form>
		)
	}
}

let confirm_page = reduxForm({
	form: 'wizard-migrate',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	// validate
})(ConfirmPage);

const mapStateToProps = (state) => {
	const selector = formValueSelector('wizard-migrate');

	// Fetch the value from the form to allow the user to confirm.
	return { form_values: {
		domain: selector( state, 'domain' ),
		subdomain: selector( state, 'subdomain' )
	} };
}

confirm_page = connect( mapStateToProps, {} )(confirm_page);

export default confirm_page;