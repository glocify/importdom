const validate = values => {

	const errors = {};

	if ( ! values.user) {
		errors.user = 'Hosting Username is required.'
	}

	if ( ! values.pass) {
		errors.pass = 'Hosting Password is required.'
	}

	if ( ! values.path) {
		errors.path = 'Hosting Path is required.'
	}

	if ( ! values.url) {
		errors.url = 'Store URL is required.'
	}
	
	return errors
};

export default validate;