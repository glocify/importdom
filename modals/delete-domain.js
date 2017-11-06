import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDomains, deleteDomain, DELETE_DOMAIN } from '../../actions/actions-domains';
import { hideModal } from '../../actions/actions-modals';
import { showLoading, showFeedback, hideFeedback } from '../../actions/actions-feedback';
import ReactModal from 'react-modal';
import { PATH_ROOT } from '../../routes';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class DeleteDomainModal extends Component {

    constructor( props ) {
        super( props );
        this.deleteResponse = this.deleteResponse.bind(this);
		this.state ={
			params: null
		}
    }

	static contextTypes = {
		router: PropTypes.object
	};

	triggerDeleteDomain() {

		this.props.showLoading( 'Deleting Domain - this may take up to a minute.' );
		this.props.hideModal();
		this.props.deleteDomain( this.props.params.domain, this.props.params.hosting_id )
		  .then( this.deleteResponse );
	}

	deleteResponse( promise ) {
		const { status } = promise.payload.data;
		let text = 'success' === status ? 'Domain Removed Successfully.' : 'Something went wrong, Please try again later.';

		this.props.showFeedback( status, text );
		this.props.fetchDomains();
		this.context.router.push( PATH_ROOT + 'domains' );
	}

	render() {

        const show = this.props.targetAction === DELETE_DOMAIN;
		const modal_data =  <div>
					<h1 style={{marginTop:"0px"}}>Confirm Deletion</h1>
					<p>Are you sure you want to completely remove this domain?</p>
					<p>
						<strong style={{color:"red"}}>This cannot be undone.</strong>
					</p>

					<button className="btn red" onClick={ this.triggerDeleteDomain.bind(this) }>Confirm Delete Domain</button>

					<button className="btn grey pull-right" onClick={ this.props.hideModal }>Cancel</button>
					</div>;
		const modal_data_error =  <div>
				<h1 style={{marginTop:"0px"}}>Error in Domain Deletion</h1>
				<p>
					<strong style={{color:"red"}}>You can't delete this domain. This domain has store associated.</strong>
				</p>

				<button className="btn grey pull-right" onClick={ this.props.hideModal }>Cancel</button>
				</div>;						
		var model = 0;
		if(this.props.params != null && this.props.params.storescount> 0){
			model = 1;
		}
		return <div>
			<ReactModal
			  isOpen={show}
			  contentLabel="Minimal Modal Example"
              style={customStyles}
			>
			{model === 1 && modal_data_error}
			{model === 0 && modal_data}

			</ReactModal>
		</div>;
	}
}

const mapStateToProps = ( state ) => {
	return state.modal;
};

const mapDispatchToProps = { deleteDomain, fetchDomains, hideModal, showLoading, showFeedback, hideFeedback };

export default connect( mapStateToProps, mapDispatchToProps )(DeleteDomainModal);