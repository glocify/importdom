import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dashboard from './dashboard';
import { fetchUserData } from '../actions/actions-user-data';

class IndexPage extends Component {

    componentWillMount() {
        this.props.fetchUserData();
    }

    renderLoading = () => {
      return <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <h3>Please wait while we check your account...</h3>
      </div>
    };

    renderInvalidUser = () => {
      return <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <h2>There was an error accessing your Instant Store Account</h2>
          <p>
              If you believe this is in error, please contact support at <a href="https://freshhelpdesk.com/" target="_blank">FreshHelpdesk.com</a>.
          </p>
      </div>
    };

    renderNoPackege = (fsb_id) => {
      return <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <h2>This account does not have any active Fresh Store Instant packages</h2>
		  <br />
          <p className="text-center">
			<a className="btn green" href={"https://app.freshstoreinstant.com/upgrade"}>Upgrade Your Account</a>
          </p>
      </div>
    };
	
    render() {
        const { notValidUser, noPackage, noUserData, fsbid } = this.props.user;

        if ( notValidUser ) {
            return this.renderInvalidUser();
		} else if ( noPackage ) {
			return this.renderNoPackege(fsbid);
        } else if ( noUserData ) {
            return this.renderLoading();
        } else {
            return <Dashboard />
        }
    }
}

const mapStateToProps = ( state ) => {
    const { attempts, data } = state.user;
    const notValidUser = data === null && attempts > 0;
	const noPackage = data === 'no_fsb' && attempts > 0;
    const noUserData = data === null && attempts === 0;
	const fsbid = state.user.fsb_id > 0 ? state.user.fsb_id : null;

    return { user: { notValidUser, noPackage, noUserData, fsbid } };
};

const mapDispatchToProps = { fetchUserData };


export default connect( mapStateToProps, mapDispatchToProps )( IndexPage );