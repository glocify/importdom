import React from 'react';
import { Field } from 'redux-form';

const DomainResults = ( props ) => {

    const { onSubmit } = props;

    return <div className="col-lg-12">
        <form onSubmit={ onSubmit }>
            <label htmlFor="domain">Search for a new domain below and if it is available then you will be able to secure it right away.</label>
            <div className="input-group">
                <Field className="form-control" placeholder="example.com" name="domain" component="input" type="text"/>
                <span className="input-group-btn">
                    <button type="submit" className="btn green">Lookup</button>
                </span>
            </div>
        </form>
    </div>
};

export default DomainResults;