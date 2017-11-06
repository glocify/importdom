import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { hideFeedback } from '../actions/actions-feedback';

// Available Note types: success, info, danger, warning, loading

class Feedback extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	button = () => {
		const { type } = this.props;

		if ( 'loading' === type ) {
			return null;
		}

		return <button onClick={ () => { this.props.hideFeedback() } }
					   className="btn grey pull-right">Dismiss</button>
	};


	render() {
		const { text } = this.props;
		let { type } = this.props;

		if ( ! type ) {
			return null;
		} else if ( 'error' === type ) {
            type = 'danger';
        }

		return <div className={`note note-${type} font-medium`}>
			<span style={{fontSize:"17px"}}>{text}</span> { this.button() }
		</div>
	}
}

const mapStateToProps = (state) => {
	const { text, type } = state.feedback;
	return { type, text };
};

export default connect( mapStateToProps, { hideFeedback } )( Feedback );