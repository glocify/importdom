import React, { Component , PropTypes } from 'react';
import { connect } from 'react-redux';
import Feedback from './feedback';
import { fetchDomains, addDomain, addSubDomain, fetchSubdomainIps } from '../actions/actions-domains';
import { fetchUserData } from '../actions/actions-user-data';
import { fetchHostingData } from '../actions/actions-hosting';
import { showFeedback, showLoading, hideFeedback } from '../actions/actions-feedback';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';
import DomainList from './domains/domain-list';
import DomainLookup from './domains/domain-lookup';
import { PATH_ROOT } from '../routes';
import { scrollToTop } from '../utilities/scrollToTop';

class DomainsPage extends Component {

    constructor( props ) {
        super( props );
        this.state = { page: 'list' }
    }

    componentWillMount() {
        this.props.fetchDomains();
        this.props.fetchHostingData();
		this.props.fetchSubdomainIps();
		this.props.fetchUserData();
    }
	
	static contextTypes = {
		router: PropTypes.object
	};

	registerNewSubDomain = ( values ) => {
        this.props.showLoading( 'Please wait while we check the subdomain is pointed to our ip address...' );
		this.props.addSubDomain( values.newSubDomain, this.props.hosting_id )
            .then( this.registerSubDomainResponse );
	};

    registerSubDomainResponse = ( action ) => {
        const { status } = action.payload.data;

        if ( 'error' === status ) {
            const { status, data} = action.payload.data;
            this.props.showFeedback( status, data );
        } else if ( 'success' === status ) {
            const message = 'Sub Domain registered successfully. You can now create stores on this Sub domain.';
            this.props.showFeedback( 'success', message );
            this.props.fetchDomains();
			this.setState( {page: 'list'} );
        }
    };
	
    registerNewDomain = ( values ) => {
        this.props.showLoading( 'Please wait while we check the domain is pointed to our nameservers...' );

        this.props.addDomain( values.newDomain, this.props.hosting_id )
            .then( this.registerDomainResponse );
    };

    registerDomainResponse = ( action ) => {
        const { status } = action.payload.data;

        if ( 'error' === status ) {
            const { status, data} = action.payload.data;
            this.props.showFeedback( status, data );
        } else if ( 'success' === status ) {
            const message = 'Domain registered successfully. You can now create stores on this domain.';
            this.props.showFeedback( 'success', message );
            this.props.fetchDomains();
			this.setState( {page: 'list'} );
        }
    };
	renderSubDomianForm() {
        const { handleSubmit, subdomain_ips } = this.props;
		const required = value => value ? undefined : 'SubDomain Name is Required';
		const subDomainField = ({ input, label, type, placeholder, meta: { touched, error } }) => (
			<div>
			  <div className="input-group">  
				<input {...input} className="form-control" type={type} placeholder={placeholder} />
					<span className="input-group-btn">
						<button type="submit" className="btn green">Add SubDomain</button>
					</span>
			  </div>
			<p style={{color: 'red'}}>{touched && error && <span>{error}</span>}</p>
			</div>
		)		
        return <form onSubmit={ handleSubmit( this.registerNewSubDomain ) }>
			<h1>Add a subdomain for your existing domain</h1>
			<p>
				This section allows you to add a subdomain only (e.g. store.mydomain.com) so you can keep your main domain and website elsewhere.
			</p>
			
			<p>Please follow these instructions:</p>

			<ol>	
				<li>Create an A record on the domain for the subdomain and point it to the IP address {subdomain_ips[0]}. If you are unsure on how to do this, please ask your domain name provider.</li>
				<li>Enter your subdomain into the box below</li>
			</ol>
			
			<p>
				You may need to allow some time for your A Record to update before you can add the subdomain here.		
			</p>
            <label htmlFor="newSubDomain">SubDomain Address</label>
			<Field name="newSubDomain" placeholder="store.mydomain.com" className="form-control" component={subDomainField} type="text" validate={[required]} />
            <br />
            <Feedback />
            <br />
            <button className="btn grey pull-right" onClick={() => this.setPage('list')}>Back to Domains</button>
        </form>		
	};
    renderForm() {
        const { handleSubmit } = this.props;
		const required = value => value ? undefined : 'Domain Name is Required';
		const domainField = ({ input, label, type, placeholder, meta: { touched, error } }) => (
		<div>
		  <div className="input-group">  
			<input {...input} className="form-control" type={type} placeholder={placeholder} />
			<span className="input-group-btn">
				<button type="submit" className="btn green">Add Domain</button>
			</span>
		  </div>
		  <p style={{color: 'red'}}>{touched && error && <span>{error}</span>}</p>
		</div>
		)
        return <form onSubmit={ handleSubmit( this.registerNewDomain ) }>
            <h3>Add your existing domain</h3>
            <p>
                Please ensure your domain has been pointed to Fresh Store Instant
                (<a target="_blank" href="https://guides.freshdevelopment.org/?s=dns">see guide for more info</a>)
                before trying to add it to your account.
            </p>

            <p>Please change the nameservers of your domain name to the following:</p>

            <ul>
                <li>dns1.thefresh.cloud</li>
                <li>dns2.thefresh.cloud</li>
                <li>dns3.thefresh.cloud</li>
                <li>dns4.thefresh.cloud</li>
            </ul>

            <p>
                If you are unsure about how to change the nameservers, please search for the
                information on your domain name provider website or ask their support team.
            </p>

            <label htmlFor="newDomain">Domain Address</label>
            <Field name="newDomain" placeholder="example.com" className="form-control" component={domainField} type="text" validate={[required]} />
            <br />
            <Feedback />
            <br />
            <button className="btn grey pull-right" onClick={() => this.setPage('list')}>Back to Domains</button>
        </form>
    }

    renderList() {

        if ( ! this.props.domains ) {
            return <span>Fetching your domains.</span>
        }

        const { domains } = this.props;

        return <div>
			<DomainList domains={domains} />
            <button className="btn blue" style={{marginRight:'15px'}} onClick={ () => this.setPage('register')}>Add Your Domain</button>
			<button className="btn blue" style={{marginRight:'15px'}} onClick={ () => this.setPage('register_subdomain')}>Add Your SubDomain</button>
            <button className="btn green-haze" onClick={ () => this.setPage('buy')}>Register a new domain</button>
            <Link className="btn grey pull-right" to={PATH_ROOT}>Back to Dashboard</Link>
            <Feedback />
        </div>
    }

    setPage = ( page ) => {
        this.setState( { page } );

        this.props.hideFeedback();
        scrollToTop();
    };

    render() {

        const { page } = this.state;
        const { hosting_id, domains, subdomain_ips ,user_data} = this.props;
		
		if(typeof user_data.status_subscription === 'undefined'){
			return <p>Loading your data...</p>;
		}else if( user_data.status_subscription == 'cancelled' || user_data.status_subscription == 'suspended' || user_data.status_subscription == 'refunded'){
			 return (
				<div className="jumbotron">
					<p>
						Your account is not active. Please <a rel={'external'} style={{color:'blue'}} href={'//app.freshstoreinstant.com/upgrade'}>click here</a> to upgrade.
					</p>
				</div>
			);
		}else{
			if ( ! hosting_id || ! domains ) {
				return <p>Loading your data...</p>
			}
			switch ( page ) {
				case 'list':
					return this.renderList();
				case 'buy':
					return <DomainLookup hosting_id={this.props.hosting_id} back={this.setPage.bind(this, 'list')} />;
				case 'register':
					return this.renderForm();
				case 'register_subdomain':
					return this.renderSubDomianForm();				
				default:
					return <p>Unknown Request</p>
			}
		}
    }
}

const mapStateToProps = ( state ) => {
    const hosting_id = state.hosting ? state.hosting.id : null;
	const user_data = state.user.data ? state.user.data : [];
	const subdomain_ips = state.domains.subdomain_ips ? state.domains.subdomain_ips : [];
    return { domains: state.domains.valid, hosting_id, subdomain_ips ,user_data};
};

const mapDispatchToProps = { fetchDomains, fetchSubdomainIps, addDomain, addSubDomain, fetchHostingData, showFeedback, showLoading, hideFeedback, fetchUserData };

const domainsPage = reduxForm({
    form: 'wizard-domains',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    // validate
})(DomainsPage);

export default connect( mapStateToProps, mapDispatchToProps )( domainsPage );