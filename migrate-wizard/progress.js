import React from 'react';
import ProgressBox from '../progress-box';

export default (props) => {

	const { selected_page } = props;

	const pages = [
		{
			page_no: 1,
			text: 'Select Domain',
			icon: 'arrow-right',
			firstlast: true
		},
		{
			page_no: 2,
			text: 'Select Subdomain',
			icon: 'arrow-right'
		},
		{
			page_no: 3,
			text: 'Confirm',
			icon: 'arrow-right',
			firstlast: false
		},
		{
			page_no: 4,
			text: 'Success',
			icon: 'arrow-right',
			firstlast: true
		},
	];

	const tabs = pages.map( ( tab ) => {

		let extra_class = tab.firstlast ? 'nopad' : '';

		return <div key={tab.page_no} className={'col-lg-3 col-md-3 col-sm-3 col-xs-12 ' + extra_class}>
			<ProgressBox
			  complete={selected_page > tab.page_no}
			  color={'grey-steel'}
			  icon={tab.icon}
			  text={tab.text}
			  number={tab.page_no} />
		</div>
	});

	return (
	  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		  {tabs}
	  </div>
	);
}



