import React from 'react';
import { Link } from 'react-router';
import { PATH_ROOT } from '../routes';

const blogthankyouForm = ( props ) => {
	
	return <div className="col-lg-12">
		<h2>Thank You!</h2>
		<p>Your blog details have been submitted to the Fresh Team. We will install your blog as soon as possible and reply to you via email.</p>
		<br/>
		<Link className="btn green pull-right" to={PATH_ROOT}>Continue</Link>
	</div>
	
	}; 

export default blogthankyouForm;