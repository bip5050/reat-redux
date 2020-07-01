import React, { Component } from 'react';
import { isEmpty, isEqual } from 'lodash';
export default class ChangePassword extends Component {
    constructor(props) {
		super(props);
		this.defaultError	=	{
			password	:	false,
			property	:	false
		}
        this.state      =   {
			formData	:	{
				password		:	'',
				conf_password	:	''
			}
        }
	}
	
	componentWillReceiveProps(props) {
		if(!!this.props.isProcessing && !props.isProcessing) {
			this.setState({
				formData	:	{
					password		:	'',
					conf_password	:	''
				}
			})
		}
	}
	
	handleSubmit = (e) => {
		e.preventDefault();
		let formData	=	{...this.state.formData} || {};
		delete formData.conf_password;
		let validate	=	this.validate();
		if(!validate.isError)
			this.props.changePassword(formData);
	}
	
	changeHandle = (e) => {
        const name = e.target.name;
		const value = e.target.value;
        this.setState({
			formData:{
				...this.state.formData,
				[name]: value
			}
		})
	}
	
	validate = () => {
		let formData	=	this.state.formData || {};
		let errors		=	{...this.defaultError};
		let isError		=	false;
		if(!!!formData.password) {
			errors.password		=	true;
			isError				=	true;
		}
		if(!!!formData.conf_password) {
			errors.conf_password=	true;
			isError				=	true;
		}
		if(!!formData.password && !!formData.conf_password && formData.password !== formData.conf_password) {
			errors.conf_password=	true;
			isError				=	true;
		}
		return {isError: isError, errors: errors};
	}

    render() {
		let formData		=	this.state.formData || {};
		let validate		=	this.validate();
		let errors			=	validate.errors;
		let isDisabled		=	validate.isError;
        return (
			<div className="merchant_box">
				<h4>Password</h4>
                <form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="rname">New Password</label>
						<input type="Password" autoComplete="off" placeholder="Enter new password" className={`t_box${(!!errors.password) ? ' error' : ''}`} name="password" value={formData.password} onChange={this.changeHandle}/>
					</div>
					<div className="form-group">
						<label htmlFor="rname">Confirm New Password</label>
						<input type="password" autoComplete="off" placeholder="Re-enter new password" className={`t_box${(!!errors.conf_password) ? ' error' : ''}`} name="conf_password" value={formData.conf_password} onChange={this.changeHandle}/>
					</div>
					<div className="text-right">
					<button type="submit" disabled={isDisabled || this.props.isProcessing} variant="primary" className={`btn btn-secondary${(!isDisabled && !this.props.isProcessing) ? ' active' :''}`}>{(!!this.props.isProcessing) ? 'Processing' : 'Submit'}</button>
					</div>
				</form>
			</div>
        )
    }
}