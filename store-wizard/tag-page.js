import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import validate from './validate';
import Feedback from '../feedback';

class TagPage extends Component {
    render() {
        const { handleSubmit, pristine, previousPage, submitting } = this.props;

        return <div className="row">
                <form onSubmit={handleSubmit}>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <p>
                            You can leave blank and change later, but you won't get credit for your sales.
                        </p>

                        <p>Don't have an affiliate tag? <a href="https://www.freshstorebuilder.com/go/apply-amazon" target="_blank">Setup your Amazon account here</a>
                        </p>

                        <Field name="tag"
                               type="text"
                               component={'input'}
                               label="Amazon Tag"
                               placeholder="(optional)"
                               className="form-control"
                        />
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <br />
                        <button type="submit" className="btn green pull-right" disabled={submitting}>Next</button>
                        <button type="button" className="previous btn grey pull-right" onClick={previousPage}>Previous</button>
                    </div>

                </form>
        </div>
    }
}

let tag_page = reduxForm({
    form: 'wizard',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(TagPage);

tag_page = connect( null, {} )(tag_page);

export default tag_page;