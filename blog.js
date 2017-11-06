import React, {Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { PATH_ROOT } from '../routes';
import { fetchUserData } from '../actions/actions-user-data';
var Glyphicon = require('react-bootstrap/lib/Glyphicon')
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger')
var Tooltip = require('react-bootstrap/lib/Tooltip')

const ACCOUNT_AREA_URL = 'https://myaccount.freshstoreinstant.com/blog/mail/';

class BlogForm extends Component {
	componentWillMount() {
		this.props.fetchUserData();
	}	
	constructor(props) {
      super(props);
	  this.state ={
		result: null
		}
	}
  static contextTypes = {
	router: PropTypes.object
  }; 
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
  onClickHandler (props) {
	$.ajax({
      url: ACCOUNT_AREA_URL,
      dataType: 'json',
      type: 'POST',
      data: {title:this.state.title,description:this.state.description, url_blog:this.state.url_blog, fromemail: this.refs.email.value},
      success: function(data) {
		  if(data.status == 'succes'){
			this.context.router.push( PATH_ROOT + 'thank-you' );
		  }else{
			 this.setState({
                result: 'Something went wrong. Please try again later.'
            }); 
		  }
      }.bind(this),
      error: function(xhr, status, err) {
		 this.setState({
			result: 'Something went wrong. Please try again later.'
		}); 
      }.bind(this)
    });
	props.preventDefault();
  }
  onChange(state,e) {
    this.setState({[state]: e.target.value});
  }
  render () {    
	var title_tooltip = <Tooltip>Please enter a name for your blog.</Tooltip> 
	var description_tooltip = <Tooltip>Enter a short description for your blog.</Tooltip> 
	var url_tooltip = <Tooltip>Please enter the URL (i.e. the location) of your blog. For example, if your store is www.mystore.com your blog URL could be blog.mystore.com.</Tooltip>  
	const { notValidUser, noUserData, data } = this.props.user;
	var accessUserType = '';
		
		if(data != null){
			accessUserType = data.status_subscription;
		}
	if(accessUserType != '' && (accessUserType == 'cancelled' || accessUserType == 'suspended' || accessUserType == 'refunded')){
		 return (
				<div className="jumbotron">
					<p>
						Your account is not active. Please <a rel={'external'} style={{color:'blue'}} href={'//app.freshstoreinstant.com/upgrade'}>click here</a> to upgrade.
					</p>
				</div>
			);
	}else{
		if ( notValidUser ) {
			return this.renderInvalidUser();
		} else if ( noUserData ) {
			return this.renderLoading();
		}
		return (<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 font-medium">
				<div>
					{this.state.result}
				</div>
			<h2>Request a Blog</h2>
			<p>In this section you can add a blog to compliment your Fresh Store.  Please fill out the form below and your blog will be setup for you as soon as possible.</p>
			<br/>
			<form name="myform" ref="form" action="/instant-stores/thank-you" onSubmit={this.onClickHandler.bind(this)}  method="post" className="form-horizontal form-bordered">	
			<div className="form-body">
						<div className="form-group">
							<label className="control-label col-md-3">
								Blog Title <OverlayTrigger overlay={title_tooltip} delayShow={300} delayHide={150}><Glyphicon className="Help" glyph="question-sign"/></OverlayTrigger>
							</label>
							<div className="col-md-4">
								<div className="input-icon right">
									<input className="form-control" name="title" onChange={this.onChange.bind(this, 'title')} id="title" type="text" placeholder="Please enter a name for your blog" required />
								</div>
							   
							</div>
						</div>
						<div className="form-group">
							<label className="control-label col-md-3">
								Blog Description <OverlayTrigger overlay={description_tooltip} delayShow={300} delayHide={150}><Glyphicon className="Help" glyph="question-sign"/></OverlayTrigger>
							</label>
							<div className="col-md-4">
								<div className="input-icon right">
									<input className="form-control" name="description" onChange={this.onChange.bind(this, 'description')} id="description" type="text" placeholder="Enter a short description for your blog" required />
								</div>
								
							</div>
						</div>
						
							<div className="form-group">
							<label className="control-label col-md-3">
								Blog URL <OverlayTrigger overlay={url_tooltip} delayShow={300} delayHide={150}><Glyphicon className="Help" glyph="question-sign"/></OverlayTrigger>
							</label>
							<div className="col-md-4">
								<div className="input-icon right">
									<input className="form-control" onChange={this.onChange.bind(this, 'url_blog')} name="url_blog" id="url_blog" type="text" placeholder="Please enter the URL (i.e. the location) of your blog. For example, if your store is www.mystore.com your blog URL could be blog.mystore.com." required />
								</div>
								
							</div>
						</div>
						 <div className="form-actions fluid">
						<div className="row">
							<div className="col-md-12">
								<div className="col-md-offset-3 col-md-9">
									<input type="hidden" value={data.email} name="email" ref="email" />
									<button type="Submit" className="btn green"><i className="fa fa-check"></i> SEND</button>
								</div>
							</div>
						</div>
					</div>			
					</div>        
			</form>

		</div>
		);
	}
  }
}
const mapStateToProps = ( state ) => {
	const { attempts, data } = state.user;
	const notValidUser = data === null && attempts > 0;
    const noUserData = data === null && attempts === 0;

    return { user: { notValidUser, noUserData, data } };
};
const mapDispatchToProps = { fetchUserData };
export default connect( mapStateToProps, mapDispatchToProps )(BlogForm);