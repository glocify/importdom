import React from 'react';

export default (props) => {

	let { color, icon, number } = props;
	const { complete, text } = props;

	if ( complete ) {
		color = 'green-haze';
		icon = 'check';
	}

	icon = 'fa fa-' + icon;

	return (
	  <div className={ 'dashboard-stat ' + color }>
		  <div className="visual">
			  <i className={icon}></i>
		  </div>
		  <div className="details">
			  <div className="number">
				  {number+'.'}
			  </div>
			  <div className="desc">
				  {text}
			  </div>
		  </div>
	  </div>
	);
}