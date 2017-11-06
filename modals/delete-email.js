import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DELETE_EMAIL, deleteEmail, fetchEmailsDomain } from '../../actions/actions-email';
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

class DeleteEmailModal extends Component {

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

	triggerDeleteEmail() {

		this.props.showLoading( 'Deleting Email - this may take up to a minute.' );
		this.props.hideModal();
		this.props.deleteEmail( this.props.params.domain )
		  .then( this.deleteResponse );
	}

	deleteResponse( promise ) {
		const { status } = promise.payload.data;
		let text = 'success' === status ? 'Email Removed Successfully.' : 'Something went wrong, Please try again later.';

		this.props.showFeedback( status, text );
		this.props.fetchEmailsDomain();
		this.context.router.push( PATH_ROOT + 'catch-all-emails/' );
	}

	render() {

        const show = this.props.targetAction === DELETE_EMAIL;
		return <div>
			<ReactModal
			  isOpen={show}
			  contentLabel="Minimal Modal Example"
              style={customStyles}
			>
			<div>
					<h1 style={{marginTop:"0px"}}>Confirm Deletion</h1>
					<p>Are you sure you want to remove this email?</p>
					<p>
						<strong style={{color:"red"}}>This cannot be undone.</strong>
					</p>

					<button className="btn red" onClick={ this.triggerDeleteEmail.bind(this) }>Confirm Delete Email</button>

					<button className="btn grey pull-right" onClick={ this.props.hideModal }>Cancel</button>
			</div>
			</ReactModal>
		</div>;
	}
}

const mapStateToProps = ( state ) => {
	return state.modal;
};

const mapDispatchToProps = { deleteEmail, fetchEmailsDomain, hideModal, showLoading, showFeedback, hideFeedback };

export default connect( mapStateToProps, mapDispatchToProps )(DeleteEmailModal);