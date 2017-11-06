import React from 'react';
import { Component, PropTypes } from 'react';
import Feedback from './feedback';
import { connect } from 'react-redux';
import { fetchEmailsDomain, DELETE_EMAIL } from '../actions/actions-email';
import { showModal } from '../actions/actions-modals';
import { fetchHostingData } from '../actions/actions-hosting';
import { showLoading, showFeedback, hideFeedback } from '../actions/actions-feedback';
import { fetchUserData } from '../actions/actions-user-data';
import RemoveEmailModal from './modals/delete-email';
import { Link } from 'react-router';
import { PATH_ROOT } from '../routes';

class EmailList extends Component {
	constructor(props) {
      super(props);
    }	
    componentWillMount() {
        this.props.fetchEmailsDomain();
	}    
    getEmailStatus( domain ) {

		const { defaultaddress } = domain;

		if(defaultaddress.includes(':blackhole:')){
			return {
				status: 'noemail',
				email: <div style={{fontStyle:'italic'}}>Not Set</div>,
				actions: [
					<Link key="add" className="btn green" to={ PATH_ROOT + domain.domain + '/add'}>Add</Link>
				]
			}
		}else if(defaultaddress.includes(':fail:')){
			return {
				status: 'fail',
				email: '',
				actions: []
			}
		}else{
			return {
				status: 'email',
				email: defaultaddress,
				actions: [
					<Link key="remove" className="btn red" onClick={this.onRemove.bind( this, domain.domain )}>Remove</Link>
				]
			}			
		}
	}	
	onRemove( domain ) {
		this.props.showModal( DELETE_EMAIL, { domain } );
	}
	render() {
		const { domains } = this.props;
		if ( domains.length === 0 ) {
			return <h4>There are no domains currently associated with your account.</h4>
		}
		const domain_list = domains.map( ( domain ) => {
			const {defaultaddress} = domain;
			const emailDetails = this.getEmailStatus(domain);
			const action = emailDetails.actions;
			const email = emailDetails.email;
			
			return <tr className="lead">
						<td>{domain.domain}</td>
						<td>{email}</td>
						<td>{action}</td>
					</tr>;
		}, this);
		
		return <div>
			<h2>Your "Catch All" Email Addresses</h2>
			<p>This section allows you to set an email address for your custom domains. Any email sent to your domain will be forwarded to this address.</p>
			<p>For example, if your domain is mycoolstore.com then any email sent to any email on that domain (such as me@mycoolstore.com , 123@mycoolstore.com , contact@mycoolstore.com) will be forwarded to the email address you choose.</p>
			<div className="table-responsive">
				<table className="table font-medium">
					<thead>
						<tr>
							<th>Domain</th>
							<th>Current Email</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{domain_list}
					</tbody>
				</table>
			</div>
            <Feedback />
			<RemoveEmailModal />
			<div className="row">
				<div className="col-md-12">
				<Link className="btn grey pull-right" to={PATH_ROOT}>Back to Dashboard</Link>
				</div>
			</div>
		</div>
	}	
}

const mapStateToProps = (state) => {
	const domains = state.emails.emaildomains ? state.emails.emaildomains : [];
    return {  domains: domains };
}

const mapDispatchToProps = {fetchEmailsDomain, showModal, showFeedback, showLoading, hideFeedback};

export default connect(mapStateToProps, mapDispatchToProps)(EmailList);

