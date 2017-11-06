import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDomains, DELETE_DOMAIN } from '../../actions/actions-domains';
import { showModal } from '../../actions/actions-modals';
import DeleteDomainModal from '../modals/delete-domain';
import { showLoading, showFeedback, hideFeedback } from '../../actions/actions-feedback';
import { fetchUserData } from '../../actions/actions-user-data';
import { Link } from 'react-router';
import { PATH_ROOT } from '../../routes';

class DomainList extends Component {
	constructor(props) {
      super(props);
	}	
	onRemoveClick( id, domain, hosting_id, storescount ) {
		this.props.showModal( DELETE_DOMAIN, { id, domain, hosting_id, storescount } );
	}	
	render() {
		const { domains } = this.props;
		if ( domains.length === 0 ) {
			return <h4>There are no domains currently associated with your account.</h4>
		}
		const domain_list = domains.map( ( domain ) => {
			const {id, storescount, hosting_id} = domain;
			const action = <button className="btn red" onClick={this.onRemoveClick.bind( this, id, domain.domain, hosting_id, storescount )}>Remove</button>;
			
			return <tr key={id} className="lead">
						<td>{domain.domain}</td>
						<td>{storescount}</td>
						<td>{action}</td>
					</tr>;
		}, this);
		
		return <div>
			<p>
				Your account automatically includes a subdomain of freshstores.co so you can rapidly sandbox your ideas.
				You can also register your own domains here and purchase new ones.
			</p>
			<h3>The Domains currently associated with your account.</h3>
			<div className="table-responsive">
				<table className="table font-medium">
					<thead>
						<tr>
							<th>Domain</th>
							<th>No. Of Stores</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{domain_list}
					</tbody>
				</table>
			</div>
			<br />
			<DeleteDomainModal />
		</div>
	}	
}

const mapStateToProps = (state) => {
    return { domains: state.domains.valid};
}

const mapDispatchToProps = {fetchDomains, fetchUserData, showModal, showFeedback, showLoading, hideFeedback};

export default connect(mapStateToProps, mapDispatchToProps)(DomainList);


