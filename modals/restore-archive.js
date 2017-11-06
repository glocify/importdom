import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { restoreArchive, RESTORE_ARCHIVE } from '../../actions/actions-archives';
import { hideModal } from '../../actions/actions-modals';
import { showLoading, showFeedback, hideFeedback } from '../../actions/actions-feedback';
import ReactModal from 'react-modal';

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

class RestoreArchiveModal extends Component {

    constructor(props) {
        super(props);

        this.restoreSuccess = this.restoreSuccess.bind(this);
        this.triggerRestoreArchive = this.triggerRestoreArchive.bind(this)
    }

	triggerRestoreArchive() {

		this.props.showLoading( 'Restoring backup archive...');
		this.props.hideModal();

		this.props.restoreArchive( this.props.params.store_id, this.props.params.archive_id )
		  .then( this.restoreSuccess );
	}

	restoreSuccess( promise ) {
		const { status, data } = promise.payload.data;
        const successMessage = 'Archive Restored Successfully.';
        const message = data === '1' ? successMessage : data;

		this.props.showFeedback( status, message );
	}

	render() {

		const show = this.props.targetAction === RESTORE_ARCHIVE;

		return <div>
			<ReactModal
			  isOpen={show}
			  contentLabel="Minimal Modal Example"
              style={customStyles}
			>

                <h1 style={{marginTop:"0px"}}>Confirm Archive Restore</h1>
                <p>Are you sure you want to restore this backup archive?</p>
                <p>
                    <strong style={{color:"red"}}>This cannot be undone.</strong>
                </p>

				<button className="btn green" onClick={ this.triggerRestoreArchive.bind(this) }>Yes</button>

				<button className="btn grey pull-right" onClick={ this.props.hideModal }>Nope</button>

			</ReactModal>
		</div>;
	}
}

const mapStateToProps = (state) => {
	return state.modal;
};

const mapDispatchToProps = { restoreArchive, hideModal, showLoading, showFeedback, hideFeedback };

export default connect( mapStateToProps, mapDispatchToProps )(RestoreArchiveModal);