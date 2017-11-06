import React from 'react';
import { Link } from 'react-router';
import { PATH_ROOT } from '../../routes';
import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import Feedback from '../feedback';
var Glyphicon = require('react-bootstrap/lib/Glyphicon')
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger')
var Tooltip = require('react-bootstrap/lib/Tooltip')



	const renderField = ({ input, type, label, placeholder, tabindex, tool_tip, meta: { touched, error } }) => (
	  <div className="form-group">
		   <label>{label} <OverlayTrigger overlay={<Tooltip id={tool_tip}>{tool_tip}</Tooltip>} delayShow={300} delayHide={150}><Glyphicon className="Help" glyph="question-sign"/></OverlayTrigger></label>
			<input {...input} className="form-control"  placeholder={placeholder} type={type} tabIndex={tabindex}/>
			  {touched && error && <span  style={{color: 'red'}}>{error}</span>}
	  </div>
	);
const ImportValidation = ( props ) => {

	const { handleSubmit, onSubmit } = props;
    return <form onSubmit={ handleSubmit( onSubmit ) }>
        <p>Make sure you've put the file in place.</p>
		
		<Field 
		name="url" 
		type="text" 
		label="Store URL" 
		placeholder="your-store.com"
		tabindex="1"
		tool_tip="This is the full URL of your store. This is what you use to visit your store (e.g. www.mystore.com)" 
		component={renderField}/>

		<Field 
		name="host" 
		type="text" 
		label="Hostname (optional)" 
		placeholder="your-fsb-store.com"
		tabindex="2"
		tool_tip="This is where you normally login to your hosting account. It can be an IP address or a URL. If in doubt you can leave this blank." 
		component={renderField}/>
		
		<Field 
		name="user" 
		type="text" 
		label="Hosting Username" 
		placeholder="username"
		tabindex="3"
		tool_tip="This is your login username for the website hosting account you are importing from. This can be your cPanel or FTP login." 
		component={renderField}/>

		<Field 
		name="pass" 
		type="text" 
		label="Hosting Password" 
		placeholder="password"
		tabindex="4"
		tool_tip="This is your login password for the website hosting account you are importing from. This can be your cPanel or FTP login." 
		component={renderField}/>
				
		<Field 
		name="path" 
		type="text" 
		label="Hosting Path" 
		placeholder="public_html/store"
		tabindex="5"
		tool_tip="This is the location of your store files on your hosting account. If you are unsure please check by logging in to your hosting account." 
		component={renderField}/>
			
	    <button type="submit" className="btn green">Validate</button>

        <br />
        <Feedback />
        <br />
        <Link to={ PATH_ROOT + 'imports/list' } className="btn grey pull-right">Back to Import List</Link>
    </form>
}

export default reduxForm({
	form: 'wizard-imports',  // a unique identifier for this form
	validate
})(ImportValidation)