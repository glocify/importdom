import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TenSecondSelectPage from './ten-second-page';
import DomainSelectPage from './domain-page';
import SubdomainSelectPage from './subdomain-page';
import ConfirmPage from './confirm-page';
import TagPage from './tag-page';
import Progress from './progress';
import { Link } from 'react-router';
import { PATH_ROOT } from '../../routes';
import { fetchUserPackage } from '../../actions/actions-user-data';
import { hideFeedback } from '../../actions/actions-feedback';
import { scrollToTop } from '../../utilities/scrollToTop';

// Based on example at http://redux-form.com/6.0.0-alpha.6/examples/wizard/

class WizardForm extends Component {
	constructor(props) {
		super(props);
		this.nextPage = this.nextPage.bind(this);
		this.previousPage = this.previousPage.bind(this);
		this.state = {
			page: 1
		}
	}
	componentWillMount() {
        this.props.fetchUserPackage();
    }
	nextPage() {
		this.setState({ page: this.state.page + 1 });
        scrollToTop();
	}
	upgradeStore() {
		const { user_package, user_data } = this.props;
		const packagetotal = user_package.packagetotal === 'undefined' ? '' : user_package.packagetotal;
		const activestores = user_package.activestores === 'undefined' ? '' : user_package.activestores;	
		const fsb_id = user_data ? user_data.fsb_id : null;
		
		if ( 0 === user_package.length ) {
			return <h3>Please wait a moment...</h3>;
		}
		return <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<div className="total_store row no-margin">
				<div className="col-md-4"><strong>Total Stores in your plan: </strong>{packagetotal}</div>
				<div className="col-md-4"><strong>Active Stores: </strong>{activestores}</div>
				<div className="col-md-4"><strong>Available Stores: </strong>{packagetotal - activestores}</div>
			</div>
			<hr/>
          <h2>Your store limit has been reached. Please upgrade your plan.</h2>
		  <br />
          <p className="text-center">
			<a className="btn green" href={"https://app.freshstoreinstant.com/upgrade"}>Upgrade</a>
          </p>
      </div>;
	}
	previousPage() {
		this.setState({ page: this.state.page - 1 });
        this.props.hideFeedback();
        scrollToTop();
	}

	render() {
		const { onSubmit, user_package, user_data } = this.props;
		const packagetotal = user_package.packagetotal === 'undefined' ? '' : user_package.packagetotal;
		const activestores = user_package.activestores === 'undefined' ? '' : user_package.activestores;	
		const fsb_id = user_data ? user_data.fsb_id : null;
		
		if(typeof user_data.status_subscription === 'undefined'){
			return <h3>Please wait a moment while we load your stores...</h3>;
		}else if( user_data.status_subscription == 'suspended' || user_data.status_subscription == 'refunded'){
			 return (
				<div className="jumbotron">
					<p>
						Your account is not active. Please <a rel={'external'} style={{color:'blue'}} href={'//app.freshstoreinstant.com/upgrade'}>click here</a> to upgrade.
					</p>
				</div>
			);
		}else{
			
			if ( 0 === user_package.length ) {
				return <h3>Please wait a moment...</h3>;
			}
			if(user_data.status_subscription == 'cancelled' || user_data.status_subscription == 'suspended' || user_data.status_subscription == 'refunded'){
				 return (
					<div className="jumbotron">
						<p>
							Your account is not active. Please <a rel={'external'} style={{color:'blue'}} href={'//app.freshstoreinstant.com/upgrade'}>click here</a> to upgrade.
						</p>
					</div>
				);
			}else{
				if( activestores >= packagetotal )
					return this.upgradeStore();
			
				const { page } = this.state;
				return <div>
					<div className="total_store row no-margin">
						<div className="col-md-4"><strong>Total Stores in your plan: </strong>{packagetotal}</div>
						<div className="col-md-3"><strong>Active Stores: </strong>{activestores}</div>
						<div className="col-md-3"><strong>Available Stores: </strong>{packagetotal - activestores}</div>
						<div className="col-md-2"><a className="btn green" href={"https://app.freshstoreinstant.com/upgrade"}>Upgrade</a></div>
					</div>
					<hr/>
					<div className="row fsipad">
						<Progress selected_page={page} />
					</div>

					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							{page === 1 && <TenSecondSelectPage onSubmit={this.nextPage}/>}
							{page === 2 && <TagPage previousPage={this.previousPage} onSubmit={this.nextPage}/>}
							{page === 3 && <DomainSelectPage previousPage={this.previousPage} onSubmit={this.nextPage}/>}
							{page === 4 && <SubdomainSelectPage previousPage={this.previousPage} onSubmit={this.nextPage}/>}
							{page === 5 && <ConfirmPage previousPage={this.previousPage} onSubmit={onSubmit}/>}
						</div>
					</div>

					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<Link style={{marginTop:"35px"}} className="btn grey pull-right" to={ PATH_ROOT + 'store-list' }>Back to Store List</Link>
						</div>
					</div>
				</div>
			}
		}
	}
}
const mapStateToProps = (state) => {
	const user_data = state.user.data ? state.user.data : [];
	return { user_package: state.stores.user_package, user_data };
}
WizardForm.propTypes = {
	onSubmit: PropTypes.func.isRequired
};

export default connect( mapStateToProps, { hideFeedback, fetchUserPackage } )( WizardForm );