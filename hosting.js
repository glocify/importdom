import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchHostingData } from '../actions/actions-hosting';
import { Link } from 'react-router';
import { PATH_ROOT } from '../routes';

class HostingPage extends Component {

    componentWillMount() {
        if ( ! this.props.hosting ) {
            this.props.fetchHostingData();
        }
    }

    render() {

        if ( ! this.props.hosting ) {
            return <h4>Loading your hosting details...</h4>
        }

        const { username, password, server } = this.props.hosting;
        const serverPort = 'https://' + server + ':2083';

        return (
            <div className="">
                <h3>cPanel Username:</h3>
                <pre>{ username }</pre>
                <h3>cPanel Password:</h3>
                <pre>{ password }</pre>
                <a target="_blank" className="btn red" href={serverPort}>Login: {serverPort}</a>

                <Link className="btn grey pull-right" to={ PATH_ROOT }>Back to Dashboard</Link>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return { hosting: state.hosting };
};

export default connect( mapStateToProps, { fetchHostingData } )( HostingPage );