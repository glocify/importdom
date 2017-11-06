import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { upgradeStore, UPGRADE_STORE } from '../../actions/actions-stores';
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

class UpgradeStoreModal extends Component {

    constructor( props ) {
        super( props );
        this.upgradeResponse = this.upgradeResponse.bind(this);
    }

	static contextTypes = {
		router: PropTypes.object
	};

	triggerUpgradeStore() {

		this.props.showLoading( 'Upgrading your Store...' );
		this.props.hideModal();

		this.props.upgradeStore( this.props.params.id )
		  .then( this.upgradeResponse );
	}

	upgradeResponse( promise ) {
		const { status, data } = promise.payload.data;
		let text = 'success' === status ? 'Your store upgrade has started. Please allow a couple of minutes to complete.' : data;

		this.props.showFeedback( status, text );
		this.context.router.push( PATH_ROOT + 'store-list' );
	}

	render() {

        const show = this.props.targetAction === UPGRADE_STORE;

		return <div>
			<ReactModal
			  isOpen={show}
			  contentLabel="Minimal Modal Example"
              style={customStyles}
			>

            <h1 style={{marginTop:"0px"}}>Confirm Upgrade</h1>
			<p>This upgrade should take less than 5 minutes and your store will be unusable during this time.<br/> The upgrade will happen automatically and a backup will be made before upgrade. <br/>Do you want to continue the upgrade?</p>

			<button className="btn red" onClick={ this.triggerUpgradeStore.bind(this) }>Yes</button>

			<button className="btn grey pull-right" onClick={ this.props.hideModal }>No</button>

			</ReactModal>
		</div>;
	}
}

const mapStateToProps = ( state ) => {
	return state.modal;
};

const mapDispatchToProps = { upgradeStore, hideModal, showLoading, showFeedback, hideFeedback };

export default connect( mapStateToProps, mapDispatchToProps )(UpgradeStoreModal);