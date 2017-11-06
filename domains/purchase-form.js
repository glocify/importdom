import React from 'react';
import { Link } from 'react-router';
import { PATH_ROOT } from '../../routes';

const ACCOUNT_AREA_URL = 'https://myaccount.freshstoreinstant.com/instant-stores/domains';

const purchaseForm = ( props ) => {

    const { itemNumber, price } = props;

    const submit = () => {
        document.forms["myform"].submit();
    };

    setTimeout(submit, 200);

    return <div className="col-lg-12">
        <h2>Redirecting to PayPal...</h2>
        <h4>If you are not automatically redirected to PayPal, use the button below.</h4>

        <form name="myform" action="https://www.paypal.com/cgi-bin/webscr" method="post">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="paypal@freshinnovationslimited.com" />
            <input type="hidden" name="item_name" value="Domain Name Purchase" />
            <input type="hidden" name="item_number" value={itemNumber} />
            <input type="hidden" name="custom" value="fsi-domain-purchase" />
            <input type="hidden" name="amount" value={price} />
            <input type="hidden" name="quantity" value="1" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="notify_url" value="https://ipn.freshdevelopment.org/queue/postback" />
            <input type="hidden" name="return" value={ACCOUNT_AREA_URL} />
            <input type="hidden" name="cancel_return" value={ACCOUNT_AREA_URL} />
            <input type="hidden" name="no_note" value="1" />
            <input type="hidden" name="no_shipping" value="1" />
            <input type="image" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif" alt="PayPal - The safer, easier way to pay online" />
        </form>

    </div>
};

export default purchaseForm;