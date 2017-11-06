import React, { Component, PropTypes } from 'react';
import SubdomainSelectPage from './wizard-subdomain';
import DomainSelectPage from './wizard-domain';
import ConfirmPage from './wizard-confirm';
import Progress from './progress';
import Feedback from '../feedback';
import { Link } from 'react-router';
import { scrollToTop } from '../../utilities/scrollToTop';
import { PATH_ROOT } from '../../routes';
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
	nextPage() {
		this.setState({ page: this.state.page + 1 });
        scrollToTop();
	}

	previousPage() {
		this.setState({ page: this.state.page - 1 });
        scrollToTop();
	}

	render() {
		const { onSubmit } = this.props;
		const { page } = this.state;
		return <div>
            <div className="row">
			  <Progress selected_page={page} />
            </div>
            <div className="row">
                {page === 1 && <DomainSelectPage onSubmit={this.nextPage}/>}
                {page === 2 && <SubdomainSelectPage previousPage={this.previousPage} onSubmit={this.nextPage}/>}
                {page === 3 && <ConfirmPage previousPage={this.previousPage} onSubmit={onSubmit}/>}
            </div>
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <Feedback />
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <Link style={{marginTop:"10px"}} className="btn grey pull-right" to={ PATH_ROOT + 'store-list' }>Back to Store List</Link>
                </div>
            </div>

		  </div>
	}
}

WizardForm.propTypes = {
	onSubmit: PropTypes.func.isRequired
};

export default WizardForm