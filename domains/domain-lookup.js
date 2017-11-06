import React, { Component } from 'react';
import { connect } from 'react-redux';
import { lookupDomain, addDomain } from '../../actions/actions-domains';
import { showFeedback, showLoading, hideFeedback } from '../../actions/actions-feedback';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';
import { PATH_ROOT } from '../../routes';
import PurchaseForm from './purchase-form';
import DomainResults from './domain-results';
import DomainSearch from './domain-searchbox';
import Feedback from '../feedback';
import { scrollToTop } from '../../utilities/scrollToTop';

class DomainLookup extends Component {

    constructor( props ) {
        super( props );
        this.state = this.initialData;
    }

    initialData = {
        domain: null,
        available: null,
        registered: null,
        domainData: null,
        price: null
    };

    lookupDomain = (data) => {
        this.props.showLoading( 'Checking if domain is available...' );
        const { domain } = data;
        this.setState( { domain } );

        this.props.lookupDomain( data.domain, this.props.hosting_id )
            .then( this.handleLookupResponse );
    };

    reset = () => {
        this.setState( this.initialData );
        scrollToTop();
    };

    registerDomain = ( data ) => {

        this.props.addDomain( this.state.domain, this.props.hosting_id, true )
            .then( ( action ) => {
                if ( 'success' === action.payload.data.status ) {
                    this.setState( {
                        domainData: action.payload.data.data,
                        available: true,
                        registered: true
                    } );
                } else {
                    this.props.showFeedback( 'error', action.payload.data.data );
                }
            } );
    };

    handleLookupResponse = ( response ) => {
        this.props.hideFeedback();

        const { data } = response.payload;
        const defaultFailMessage = 'This domain name is not available to purchase through Fresh Store Instant.';

        if ( 'success' === data.status ) {

            const { namecheap, fwhprice } = data.data;

            if ( 'true' === namecheap.IsPremiumName ) {
                this.setState( { available: false } );
                this.props.showFeedback( 'warning', defaultFailMessage );
            } else if ( 'true' === namecheap.Available ) {
                this.setState( { available: true, registered: false, price: fwhprice } );
            } else if ( 'false' === namecheap.Available ) {
                this.setState( { available: false } );
                this.props.showFeedback( 'warning', 'This domain is unavailable.' );
            } else {
                this.setState( { available: false, registered: false } );

                const feedback = message ? message : defaultFailMessage;
                this.props.showFeedback( 'warning', feedback );

                console.log('Unhandled response');
                console.log(response);
            }
        } else {
            this.props.showFeedback( 'warning', defaultFailMessage );
        }
    };

    render() {

        const { available, registered, domain, domainData, price } = this.state;

        let main = null;

        if ( available && registered ) {
            main = <PurchaseForm domain={domain} itemNumber={domainData} price={price} back={ this.props.reset } />
        }
        else if ( available && ! registered ) {
            main = <DomainResults domain={domain} price={price} action={this.registerDomain} back={this.reset} />
        } else {
            const { handleSubmit, pristine, submitting } = this.props;
            main = <DomainSearch onSubmit={handleSubmit(this.lookupDomain)} />
        }

        return <div className="row">

            {main}

            <div className="col-lg-12">
                <br />
                <button className="btn grey pull-right" onClick={this.props.back}>Back to Domains</button>
            </div>
            <div className="col-lg-12">
                <br />
                <Feedback />
            </div>
        </div>
    }
}

const mapDispatchToProps = { lookupDomain, addDomain, showFeedback, showLoading, hideFeedback };

const domainLookup = reduxForm({
    form: 'lookup-domains',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    // validate
})(DomainLookup);

export default connect( null, mapDispatchToProps )( domainLookup );