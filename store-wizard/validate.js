const validate = values => {

	const errors = {};

	if ( ! values.domain) {
		errors.domain = 'Please select a domain from the dropdown.'
	}

	if( ! values.ten_second_store) {
		errors.ten_second_store = "Please choose a Store Template or select 'Create a new blank store'"
	}
	
	if ( values.subdomain && null === values.subdomain.match( '^[a-zA-Z0-9-]*$' ) ) {
		errors.subdomain = 'Not a valid subdomain. You can only use letters, digits or hyphens.'
	}

	return errors
};

export default validate;