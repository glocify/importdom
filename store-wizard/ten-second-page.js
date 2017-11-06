import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import validate from './validate'
// import renderField from './renderField'
import { fetch10SecondStores } from '../../actions/actions-10ss';
import { updateFormValue } from '../../actions/actions-forms';
import { fetchPremiumStores } from '../../utilities/10ss';

const renderError = ({ meta: { touched, error } }) => touched && error ?
  <span>{error}</span> : false;

const validLocales = ['usa', 'es'];

class TenSecondSelectPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			locale: 'usa'
		};

		this.noTenSecondStore = this.noTenSecondStore.bind(this);
	}

	componentWillMount() {
		this.props.fetch10SecondStores();
	}

	handleLocale( event ) {
        const countryCode = event.target.value;
		this.setState( { locale: countryCode } );
	}

	noTenSecondStore() {
		this.props.updateFormValue( 'wizard', 'ten_second_store', '' );
		this.props.onSubmit();
	}
	onClickHandNext() {
	 // alert('Please choose a Store Template or select 'Create a new blank store'');
	  //return false;
  }
	renderRadioButton = ( element ) => {

        const name = element.data.name;

		return (
		  	<div className="input-group">
				<span className="input-group-addon">
					<input id={'checkbox-'+element.input.value} {...element.input} type="radio" aria-label="Radio button for following text input"/>
				</span>
				<label htmlFor={'checkbox-'+element.input.value}
					   type="text"
					   className="form-control"
					   name={name}
					   aria-label="Text input with radio button">
					{name}
				</label>
		  	</div>
		);
	}

	renderRadioButtons = ( locale ) => {
        const ten_second_stores = fetchPremiumStores( this.props.ten_second_stores, locale );

        return ten_second_stores.map( ( store ) => {

			return <div className="col-lg-4" key={store.id}>
				<Field name="ten_second_store"
                       props={{data: {
                           id: store.id.toString(),
                           name: store.name
                       }}}
                       component={this.renderRadioButton}
					   type="radio"
					   value={store.id.toString()} />
			</div>
		});
	}

	get_locale( code ) {
		const locales = this.get_locales();
		return locales[code];
	}

	get_locales() {
		return {
			usa: 'Amazon.com (United States)',
			uk: 'Amazon.co.uk (United Kingdom)',
            ca: 'Amazon.ca (Canada)',
            fr: 'Amazon.fr (France)',
			es: 'Amazon.es (Spain)',
            it: 'Amazon.it (Italy)',
            de: 'Amazon.de (Germany)',
            jp: 'Amazon.co.jp (Japan)',
            cn: 'Amazon.cn (China)',
            in: 'Amazon.in (India)',
            br: 'Amazon.br (Brazil)'
		};
	}

	renderLocaleSelect() {
		const locales = this.get_locales();

		const options = Object.keys( locales ).map( ( code ) => {
            return <option key={code} value={code}>{ locales[code]}</option>;
 		});

		return <select className="form-control" onChange={this.handleLocale.bind(this)}>
			{options}
		</select>
	}

	render() {

		const { handleSubmit, pristine, submitting, ten_second_stores } = this.props;
		const { locale } = this.state;

		if ( ten_second_stores.length === 0 ) {
			return <span>Loading...</span>
		}

		return (
		  <form onSubmit={handleSubmit}>
			  <div className="row fsipad" style={{paddingBottom:"10px"}}>
				  <div className="col-lg-4">
					  <h4>Select Store Locale</h4>
				  </div>
				  <div className="col-lg-8">
					  {this.renderLocaleSelect()}
				  </div>
			  </div>

			  <div className="row fsipad">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				    <h4>Select Store Template</h4>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{marginBottom:"10px"}}>
				    <button type="button" className="btn-space previous btn red" onClick={this.noTenSecondStore}>Create a new blank store</button>
                  </div>				  
				  {this.renderRadioButtons( locale )}
			  </div>
			  <div className="row fsipad">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<p>Please choose a store template before clicking 'Next'</p>
				</div>
			  </div>			
			  <div className="row fsipad" style={{marginTop:"15px"}}>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <button type="submit" style={{marginRight:'10px'}} className="btn-space btn green next pull-right" disabled={pristine || submitting} >Next</button>
                  </div>
			  </div>
		  </form>
		);
	};
}

 

let wizard_form =  reduxForm({
	form: 'wizard',
	destroyOnUnmount: false,
	forceUnregisterOnUnmount: true,
	validate
} )(TenSecondSelectPage);

const mapStateToProps = ( state ) => {

    if ( state.user.data === null ) {
        return { ten_second_stores: [] };
    }

    const ten_second_stores = state.ten_second_stores.flat;
    const { premium } = state.user.data;
	return { ten_second_stores, premium };
};

wizard_form = connect( mapStateToProps, { fetch10SecondStores, updateFormValue } )(wizard_form);

export default wizard_form;