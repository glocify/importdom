import React from 'react'

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
	  <label>{label}</label>
	  <div>
		  <input {...input} placeholder={label} type={type}/>
		  {touched && error && <span>{error}</span>}
	  </div>
  </div>
)

export default renderField

export const subdomainField = ({ input, label, type, placeholder, domain, maxlength, meta: { touched, error } }) => (
  <div>
	  <label>{label}</label>
	  <div className="input-group">
		  <input {...input} className="form-control" type={type} placeholder={placeholder} maxLength={maxlength} aria-describedby="basic-addon2" />
		  <span className="input-group-addon" id="basic-addon2">.{domain}</span>
	  </div>
	  {touched && error && <span>{error}</span>}
  </div>
)