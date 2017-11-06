import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { STORE_PROCESS_CANCEL, storeProcessCancel, fetchStores } from '../../actions/actions-stores';
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

class CancelStoreModal extends Component {

    constructor( props ) {
        super( props );
        this.cancelResponse = this.cancelResponse.bind(this);
    }

	static contextTypes = {
		router: PropTypes.object
	};

	triggerCancelStoreProcess() {

		this.props.showLoading( 'Canceling Store - this may take up to a minute.' );
		this.props.hideModal();

		this.props.storeProcessCancel( this.props.params.id )
		  .then( this.cancelResponse );
	}

	cancelResponse( action ) {
		if ( 'success' === action.payload.data.status ) {
            this.props.showFeedback( 'success', 'Store has been cancelled.');
        } else {
            this.props.showFeedback( 'error', action.payload.data.data );
        }
		this.props.fetchStores();
		this.context.router.push( PATH_ROOT + 'store-list' );
	}

	render() {

        const show = this.props.targetAction === STORE_PROCESS_CANCEL;

		return <div>
			<ReactModal
			  isOpen={show}
			  contentLabel="Minimal Modal Example"
              style={customStyles}
			>

            <h1 style={{marginTop:"0px"}}>Please Confirm</h1>
			<p>Are you sure you want to cancel this store install?"</p>
			<p>
                <strong style={{color:"red"}}>This can't be undone.</strong>
            </p>

			<button className="btn red" onClick={ this.triggerCancelStoreProcess.bind(this) }>Cancel Install</button>

			<button className="btn grey pull-right" onClick={ this.props.hideModal }>No, keep this store</button>

			</ReactModal>
		</div>;
	}
}

const mapStateToProps = ( state ) => {
	return state.modal;
};

const mapDispatchToProps = { fetchStores, storeProcessCancel, hideModal, showLoading, showFeedback, hideFeedback };

export default connect( mapStateToProps, mapDispatchToProps )(CancelStoreModal);