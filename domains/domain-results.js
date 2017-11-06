import React from 'react';
import Feedback from '../feedback';

const DomainResults = ( props ) => {

    const { itemNumber, price, domain, action, back } = props;

    return <div>

        <div className="col-lg-12">

            <h3>This domain is available - would you like to register it?</h3>
            <table style={{width:'100%'}}>
                <tbody>
                    <tr>
                        <td><h4>{domain}</h4></td>
                        <td className="pull-right"><h4>${price}</h4></td>
                        <td><button className="btn red pull-right" onClick={action}>Purchase this domain</button></td>
                    </tr>
                </tbody>
            </table>

        </div>

        <div className="col-lg-12">
            <Feedback />
        </div>

        <div className="col-lg-12">
            <button className="btn blue pull-right" onClick={ back } >Try a different domain</button>
        </div>
    </div>
};

export default DomainResults;