import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
// import validate from './validate';
import { availableDomains } from '../../actions/actions-stores';
import { fetchDomains } from '../../actions/actions-domains';
import { fetchHostingData } from '../../actions/actions-hosting';

class DomainSelectPage extends Component {

	componentWillMount() {
		this.props.fetchDomains();
        this.props.fetchHostingData();
		this.props.availableDomains();
	}

	render() {

		if ( this.props.domains === undefined ) {
			return <h3> Loading available domains...</h3>;
		}

		const renderDomainSelector = ({ input, meta: { touched, error } }) => (
		  <div className="form-group">
			  <select className="form-control" {...input}>
				  <option value="">Select a domain...</option>
				  {this.props.domains.map(val => <option value={val} key={val}>{val}</option>)}
			  </select>
			  {touched && error && <span>{error}</span>}
		  </div>
		);

		const { handleSubmit, previousPage } = this.props;

		return <form onSubmit={handleSubmit}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<label>Select which Domain to use</label>
				<Field name="domain" component={renderDomainSelector}/>
			</div>

            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="previous btn grey" onClick={previousPage}>Previous</button>
                <button type="submit" className="next btn green">Next</button>
            </div>
		</form>
	}
}

let domain_form = reduxForm({
	form: 'wizard-migrate',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	// validate
})(DomainSelectPage);

const mapStateToProps = (state) => {
	return { domains: state.domains.available };
};


export default connect(mapStateToProps, { fetchDomains, availableDomains, fetchHostingData })(domain_form);