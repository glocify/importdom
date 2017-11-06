import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { Link } from 'react-router';
import Feedback from './feedback';
import { fetchEmailsDomain, setDomainSelected, addNewEmail } from '../actions/actions-email';
import { showLoading, showFeedback, hideFeedback } from '../actions/actions-feedback';
import { PATH_ROOT } from '../routes';
const required = value => value ? undefined : 'Email is Required';
const renderError = ({ meta: { touched, error } }) => touched && error ?
<span>{error}</span> : false;
class AddEmailList extends Component {
    constructor( props ) {
        super( props );
    }
    componentWillMount() {
        this.props.fetchEmailsDomain();
        this.props.setDomainSelected( this.props.params.domain );
    }
    static contextTypes = {
		router: PropTypes.object
    };
    onChange(state,e) {
		this.setState({[state]: e.target.value});
	}
    registerNewEmail = ( values ) => {
        const { domain } = this.props;
        if(values.email && domain.domain){
            this.props.showLoading( 'Please wait while we creating your email address' );
	    	this.props.addNewEmail( values.email, domain.domain )
                .then( this.registerEmailResponse );
        } 
    }

    registerEmailResponse = ( action ) => {
        const { status } = action.payload.data;
        if ( 'error' === status ) {
            const { status, data} = action.payload.data;
            this.props.showFeedback( status, data );
        } else if ( 'success' === status ) {
            const message = 'Email registered successfully.';
            this.props.showFeedback( 'success', message );
            this.context.router.push( PATH_ROOT + 'catch-all-emails' );
        }
    };
    render() {
        const { handleSubmit, pristine, previousPage, submitting, domain } = this.props;
		if(typeof domain === 'undefined'){
            return <h3>Please wait a moment while we load this page...</h3>;
        }  
        return <div className="row">
                <form onSubmit={handleSubmit( this.registerNewEmail )}>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <p>
                            Your Domain:
                        </p>
                        <input className="form-control" type="text" value={domain.domain} disabled />
                    </div>                        
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <p>
                            Enter your email address:
                        </p>
                        <Field name="email"
                               type="email"
                               component={'input'}
                               label="Email"
                               placeholder="Enter your email."
                               className="form-control"
                               onChange={this.onChange.bind(this, 'email')}
                               validate={required}
                        />
                        <p>{renderError}</p>
                    </div>
                    
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <br />
                        <button type="submit" className="btn green pull-right" disabled={pristine || submitting}>Submit</button>
                    </div>

                </form>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			        <Feedback />
		        </div>
        </div>
    }
}

let email_page = reduxForm({
    form: 'wizard',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(AddEmailList);


const mapStateToProps = (state) => {
    const domains = state.emails.emaildomains ? state.emails.emaildomains : [];
    const matchId = domains => {
        return state.emails.selected === domains.domain;
    };	
    const domain = domains.find( matchId );
    return {  domain: domain };
}
const mapDispatchToProps = {fetchEmailsDomain, addNewEmail, setDomainSelected, showFeedback, showLoading, hideFeedback};
email_page = connect( mapStateToProps, mapDispatchToProps )(email_page);

export default email_page;

