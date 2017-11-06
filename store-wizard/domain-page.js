import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import validate from './validate';
import { availableDomains } from '../../actions/actions-stores';
import { fetchHostingData } from '../../actions/actions-hosting';
import { fetchDomains } from '../../actions/actions-domains';

class DomainSelectPage extends Component {

    componentWillMount() {
        this.props.fetchDomains();
		this.props.fetchHostingData();
		this.props.availableDomains();
    }

	render() {

        const { domains } = this.props;

        if ( domains === undefined ) {
            return <h3>Loading available domains...</h3>;
        }

        const renderDomainSelector = ({ input, meta: { touched, error } }) => (
            <div className="form-group">
                <select className="form-control" {...input}>
                    <option value="">Select a domain...</option>
                    {domains.map(val => <option value={val} key={val}>{val}</option>)}
                </select>
                {touched && error && <span>{error}</span>}
            </div>
        );

		const { handleSubmit, previousPage } = this.props;

		return <form onSubmit={handleSubmit}>

			<div>
				<label>Select which Domain to use</label>
				<Field name="domain" component={renderDomainSelector}/>
			</div>

			<button type="submit" className="next btn green pull-right">Next</button>
            <button type="button" className="previous btn grey pull-right" onClick={previousPage}>Previous</button>
		</form>
	}
}

let domain_form = reduxForm({
	form: 'wizard',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate
})(DomainSelectPage);

const mapStateToProps = ( state ) => {
    return { domains: state.domains.available };
};

export default connect(mapStateToProps, { availableDomains, fetchHostingData, fetchDomains })(domain_form);