import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { deleteStore, setStoreDeleted, DELETE_STORE } from '../../actions/actions-stores';
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

class DeleteStoreModal extends Component {

    constructor( props ) {
        super( props );
        this.deleteResponse = this.deleteResponse.bind(this);
    }

	static contextTypes = {
		router: PropTypes.object
	};

	triggerDeleteStore() {

		this.props.showLoading( 'Deleting Store - this may take up to a minute.' );
		this.props.hideModal();
		this.props.setStoreDeleted(this.props.params.id);
		this.context.router.push( PATH_ROOT + 'store-list' );
		this.props.deleteStore( this.props.params.id )
		  .then( this.deleteResponse );
	}

	deleteResponse( promise ) {
		const { status, data } = promise.payload.data;
		let text = 'success' === status ? 'Store Removed Successfully.' : data;

		this.props.showFeedback( status, text );
		this.context.router.push( PATH_ROOT + 'store-list' );
	}

	render() {

        const show = this.props.targetAction === DELETE_STORE;

		return <div>
			<ReactModal
			  isOpen={show}
			  contentLabel="Minimal Modal Example"
              style={customStyles}
			>

            <h1 style={{marginTop:"0px"}}>Confirm Deletion</h1>
			<p>Are you sure you want to completely remove this store?</p>
			<p>
                <strong style={{color:"red"}}>This cannot be undone.</strong>
            </p>

			<button className="btn red" onClick={ this.triggerDeleteStore.bind(this) }>Confirm Delete Store</button>

			<button className="btn grey pull-right" onClick={ this.props.hideModal }>Cancel</button>

			</ReactModal>
		</div>;
	}
}

const mapStateToProps = ( state ) => {
	return state.modal;
};

const mapDispatchToProps = { deleteStore, setStoreDeleted, hideModal, showLoading, showFeedback, hideFeedback };

export default connect( mapStateToProps, mapDispatchToProps )(DeleteStoreModal);