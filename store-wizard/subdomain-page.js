import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import validate from './validate';
import { subdomainField } from './renderField';
import Feedback from '../feedback';
import { showFeedback, showLoading, hideFeedback } from '../../actions/actions-feedback';
import { checkSubDomain } from '../../actions/actions-domains';
import { updateFormValue } from '../../actions/actions-forms';
import { lower } from '../../normalize/normalize-subdomain';
import { not } from '../../utilities/domains';

const renderError = ({ meta: { touched, error } }) => touched && error ?
  <span>{error}</span> : false;
const required = value => value ? undefined : 'Subdomain is Required';
class SubdomainSelectPage extends Component {

	constructor(props){
		super(props);
		this.state ={
			subdomain: ''
		}
		this.noSubdomain = this.noSubdomain.bind(this);
		this.subDomainCheck = this.subDomainCheck.bind(this);
		this.subDomainValidationCheck = this.subDomainValidationCheck.bind(this);
	}
	noSubdomain() {
		this.props.updateFormValue( 'wizard', 'subdomain', '' );
		this.props.onSubmit();
	}
	onChange(state,e) {
		this.setState({[state]: e.target.value});
	}
	onKeyPress(event) {
		if (event.which === 13 ) {
		  event.preventDefault();
		}
	}
	subDomainValidationCheck(){
		const { domain } = this.props;
		const subdomain = this.state.subdomain;
		if(subdomain == ''){
			this.onChange.bind(this, 'subdomain');
			const errors = {};
			errors.subdomain = subdomain ? undefined : 'Subdomain is Required'
			this.props.validate('subdomain');
			return errors;
		}else{
			this.props.showLoading( 'Please wait while we check subdomain...' );
			this.props.checkSubDomain(domain, subdomain).then(this.handleValidationResponse);
		}
	}
	subDomainCheck(props){
		const { domain } = this.props;
		const subdomain = this.state.subdomain;
		if(subdomain == ''){
			this.props.onSubmit();
		}else{
			this.props.showLoading( 'Please wait while we check subdomain...' );
			this.props.checkSubDomain(domain, subdomain).then(this.handleResponse);
		}
		
	}
	handleResponse = (response) => {
		if ( 'success' === response.payload.data.status ) {
			const { data } = response.payload.data;
			if(data > 0 && this.state.subdomain == ''){
				this.props.showFeedback( 'error', 'This domain is already taken, please try another.');
			}else if(data > 0){
				this.props.showFeedback( 'error', 'This subdomain is already taken, please try another.');
			}else{
				this.props.hideFeedback();
				this.props.onSubmit();
			}
        }
	}
	handleValidationResponse = (response) => {
		if ( 'success' === response.payload.data.status ) {
			const { data } = response.payload.data;
			if(data > 0){ 
				this.props.showFeedback( 'error', 'This subdomain is already taken, please try another.');
			}else{
				this.props.hideFeedback();
				this.props.onSubmit();
			}
        }
	};	
	render() {

		const { handleSubmit, pristine, previousPage, submitting, domain, store_domains } = this.props;
		const sub_domain = not(domain, store_domains);
		return (<div>
		  <form onKeyPress={this.onKeyPress} onSubmit={handleSubmit}>

			  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			  {sub_domain === true ? <Field name="subdomain"
						 type="text"
						 component={subdomainField}
						 label="Subdomain (required)"
						 placeholder="your-store-subdomain"
						 normalize={lower}
						 className="form-control"
						 domain={domain}
						 maxlength="60"
						 onChange={this.onChange.bind(this, 'subdomain')}
						 validate={[required]}
				  /> : <Field name="subdomain"
						 type="text"
						 component={subdomainField}
						 label="Subdomain (not required)"
						 placeholder="your-store-subdomain"
						 normalize={lower}
						 className="form-control"
						 domain={domain}
						 maxlength="60"
						 onChange={this.onChange.bind(this, 'subdomain')}
				  />}
				  

				  <p>{renderError}</p>
			  </div>

			  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				  {sub_domain !== true && <button type="button" className="previous btn red" onClick={this.noSubdomain}>Do not use a subdomain</button>}

				  {sub_domain === true ? <button type="button" className="btn green pull-right" disabled={pristine || submitting} onClick={this.subDomainValidationCheck}>Next</button> :<button type="button" className="btn green pull-right" disabled={pristine || submitting} onClick={this.subDomainCheck}>Next</button>}
                  <button type="button" className="previous btn grey pull-right" onClick={previousPage}>Previous</button>
			  </div>
		  </form>
		  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<Feedback />
		  </div>		
		 </div>
		)
	}
};

let subdomain_page = reduxForm({
	form: 'wizard',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate
})(SubdomainSelectPage);

const mapStateToProps = (state) => {
	const selector = formValueSelector('wizard');
	const store_domains = state.domains.availableDomains;
	return { domain: selector( state, 'domain' ), store_domains: store_domains };
};

subdomain_page = connect( mapStateToProps, { updateFormValue, checkSubDomain, showFeedback, showLoading, hideFeedback } )(subdomain_page);

export default subdomain_page;