import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import validate from '../store-wizard/validate';
import { updateFormValue } from '../../actions/actions-forms';
import { subdomainField } from '../store-wizard/renderField';
import { lower } from '../../normalize/normalize-subdomain';
import { not } from '../../utilities/domains';

const renderError = ({ meta: { touched, error } }) => touched && error ?
  <span>{error}</span> : false;
const required = value => value ? undefined : 'Subdomain is Required';

class SubdomainSelectPage extends Component {
    render() {
        const { handleSubmit, pristine, previousPage, submitting, domain, store_domains } = this.props;
		const sub_domain = not(domain, store_domains);
        return <form onSubmit={handleSubmit}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			  {sub_domain === true ? <Field name="subdomain"
						 type="text"
						 component={subdomainField}
						 label="Subdomain (required)"
						 placeholder="your-store-subdomain"
						 normalize={lower}
						 className="form-control"
						 domain={domain}
						 validate={[required]}
				  /> : <Field name="subdomain"
						 type="text"
						 component={subdomainField}
						 label="Subdomain (not required)"
						 placeholder="your-store-subdomain"
						 normalize={lower}
						 className="form-control"
						 domain={domain}
				  />}
				  

				  <p>{renderError}</p>					
            </div>

            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="previous btn grey" onClick={previousPage}>Previous</button>
                <button type="submit" className="btn green" disabled={pristine || submitting}>Next</button>
            </div>
        </form>
    }
}

let subdomain_page = reduxForm({
	form: 'wizard-migrate',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate
})(SubdomainSelectPage);

const mapStateToProps = (state) => {
    const selector = formValueSelector('wizard-migrate');
	const store_domains = state.domains.availableDomains;
    return { domain: selector( state, 'domain' ), store_domains: store_domains  };
};

subdomain_page = connect( mapStateToProps, { updateFormValue } )(subdomain_page);

export default subdomain_page;