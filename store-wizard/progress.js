import React from 'react';
import ProgressBox from '../progress-box';

export default (props) => {

	const { selected_page } = props;

	const pages = [
		{
			page_no: 1,
			text: 'Select Store Template',
			icon: 'arrow-right',
			firstlast: true
		},
        {
            page_no: 2,
            text: 'Enter Tag',
            icon: 'arrow-right',
        },
		{
			page_no: 3,
			text: 'Select Domain',
			icon: 'arrow-right'
		},

        {
            page_no: 4,
            text: 'Select Subdomain',
            icon: 'arrow-right',
            firstlast: true
        },
	];

    const columnWidth = 12 / pages.length;
    const mainClass = 'col-lg-' + columnWidth + ' col-md-' + columnWidth + ' col-sm-' + columnWidth + ' col-xs-12 ';

	const tabs = pages.map( ( tab ) => {
		return <div key={tab.page_no} className={mainClass}>
			<ProgressBox
			  complete={selected_page > tab.page_no}
			  color={'grey-steel'}
			  icon={tab.icon}
			  text={tab.text}
			  number={tab.page_no} />
		</div>
	});

    return <div>{tabs}</div>
}



