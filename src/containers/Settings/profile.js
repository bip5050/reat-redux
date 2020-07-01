import React, { Component } from 'react';
import { isEmpty, isEqual } from 'lodash';
export default class Profile extends Component {
    constructor(props) {
		super(props);
		this.defaultError	=	{
			first_name	:	false,
			last_name	:	false,
			email		:	false
		}
        this.state      =   {
			formData	:	{
				first_name	:	'',
				last_name	:	'',
				email		:	''
			},
			/* errors		:	{
				first_name	:	false,
				last_name	:	false,
				email		:	false
			} */
        }
	}
	
	componentDidMount() {
		//console.log('Component Did Mount');
		this.props.getInfo();
	}
	
	componentWillReceiveProps(props) {
		//console.log('componentWillReceiveProps');
		//console.log(props.profileData, this.props.profileData, !isEqual(props.profileData, this.props.profileData));
		if(!isEmpty(props.profileData) && !isEqual(props.profileData, this.props.profileData)) {
			this.setState({
				formData : {...props.profileData}
			})
		}
	}
	
	handleProfileSubmit = (e) => {
		e.preventDefault();
		let formData	=	{...this.state.formData} || {};
		delete formData.show_report;
		let validate	=	this.validate();
		if(!validate.isError)
			this.props.updateProfile(formData);
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
		//let errors		=	this.state.errors || {};
		let errors			=	{...this.defaultError};
		let isError		=	false;
		if(!!!formData.first_name) {
			errors.first_name	=	true;
			isError				=	true;
		}
		if(!!!formData.last_name) {
			errors.last_name	=	true;
			isError				=	true;
		}
		if(!!!formData.email) {
			errors.email		=	true;
			isError				=	true;
		}
		return {isError: isError, errors: errors};
	}

    render() {
		let formData		=	this.state.formData || {};
		let validate		=	this.validate();
		let errors			=	validate.errors || {};
		let isDisabled		=	validate.isError;
		/* if(!!errors.first_name || !!errors.last_name || !!errors.email) {
			isDisabled		=	true;
		} */
        return (
            <div className="merchant_box">
                <form onSubmit={this.handleProfileSubmit}>
                    <h4>Personal Info</h4>
                    <div className="form-group">
                        <label htmlFor="rname">First Name</label>
                        <input type="text" autoComplete="off" placeholder="Enter first name" className={`t_box${(!!errors.first_name) ? ' error' : ''}`} name="first_name" value={formData.first_name} onChange={this.changeHandle}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rname">Last Name</label>
                        <input type="text" autoComplete="off" placeholder="Enter last name" className={`t_box${(!!errors.last_name) ? ' error' : ''}`} name="last_name" value={formData.last_name} onChange={this.changeHandle}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rname">Email</label>
                        <input type="email" autoComplete="off" placeholder="Enter Email" className={`t_box${(!!errors.email) ? ' error' : ''}`} name="email" value={formData.email} onChange={this.changeHandle}/>
                    </div>
                    <div className="text-right">
                        <button type="submit" disabled={isDisabled || this.props.isProcessing} variant="primary" className={`btn btn-secondary${(!isDisabled && !this.props.isProcessing) ? ' active' :''}`}>{(!!this.props.isProcessing) ? 'Processing' : 'Submit'}</button>
                    </div>
                </form>
            </div>
        )
    }
}