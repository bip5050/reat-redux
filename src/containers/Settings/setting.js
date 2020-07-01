import React from 'react';
import lodash from 'lodash';
import { PropTypes as PT } from 'prop-types';
import { withRouter } from 'react-router-dom';
import Profile from './profile';
import ChangePassword from './changePassword';
import Stores from './stores';
import AddLocation from '../Modals/addLocation';
import Users from './users';
import AddUserModal from '../Modals/addUserModal';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class SettingComponent extends React.Component {
	static propTypes = {
		isLoading: PT.bool,
		addUser: PT.func,
		editUser: PT.func,
		getUsers: PT.func,
		deleteUser: PT.func,
		suspendUser: PT.func,
		usersList: PT.object,
		profileData: PT.object,
		isUserLoading: PT.bool,
		isUserUpdating: PT.bool
	};

	static defaultProps = {
		usersList: {},
		profileData: {},
	 	addUser: () => { },
	 	editUser: () => { },
	 	getUsers: () => { },
	 	suspendUser: () => { },
	 	deleteUser: () => { },
	 	isUserLoading: false,
	 	isUserUpdating: false
	};

	constructor(props) {
		super(props);
		this.state = {
			type		:	'General',
			show		:	false,
			showUserModel :	false,
			userAction: null,
			initialUserErrorData: {
				first_name: '',
                last_name: '',
                email: '',
                user_type: ''
			},
			initialUserData: {
				first_name: '',
                last_name: '',
                email: '',
                user_type: 'general',
                active: true,
                show_report: false
			}
		}; 

		this.handleShowUserModel = this.handleShowUserModel.bind(this);
	};

	handleShowLocation	= () => {
		this.setState({
			show: true
		})
	};

	handleShowUserModel(action, id) {
		id = id || null;
		action = action || null;

		if (action === 'ADD') {
			this.setState({
				userAction: action,
				showUserModel: true,
				initialUserErrorData: {
					first_name: '',
	                last_name: '',
	                email: '',
	                user_type: ''
				},
				initialUserData: {
					first_name: '',
	                last_name: '',
	                email: '',
	                user_type: 'general',
	                active: true,
	                show_report: false
				}
			});
		} else if (action === 'EDIT') {
			let userObj = this.props.usersList || {};
			let users = (userObj && userObj.users) || [];
			let team = lodash.find(users, { id: id });
			if (typeof team === 'object') {
				let initialData = lodash.pick(team, ['id', 'first_name', 'last_name', 'email', 'user_type', 'active', 'show_report']);

				initialData.active = (initialData.active === 'true')?true:false;
				initialData.show_report = (initialData.show_report === 'true')?true:false;

				this.setState({
					userAction: action,
					showUserModel: true,
					initialUserData: initialData,
					initialUserErrorData: {
						first_name: '',
		                last_name: '',
		                email: '',
		                user_type: ''
					}
				});				
			} else {
				console.log('The document not found');
			}
		} else if (action === 'SUSPEND') {
			confirmAlert({
				title: "Suspend this user's account?",
				message: 'This user will not be able to access their account until their account is reinstated.',
				closeOnClickOutside: false,
				buttons: [					
					{
						label: 'Cancel',
						onClick: () => console.log('Click No')
					},
					{
						label: 'Suspend',
						onClick: () => {
							let userObj = this.props.usersList || {};
							let users = (userObj && userObj.users) || [];
							let team = lodash.find(users, { id: id });
							if (typeof team === 'object') {
								let initialData = lodash.pick(team, ['id', 'first_name', 'last_name', 'email', 'user_type', 'show_report']);

								initialData.active = 'false';
								this.props.suspendUser(initialData);			
							} else {
								console.log('The document not found');
							}
			          	}
					}
				]
			});		
		} else if (action === 'DELETE') {
			confirmAlert({
				title: "Delete this user's account?",
				message: 'Deleting an account will permanently removed it from your database.',
				closeOnClickOutside: false,
				buttons: [
					{
						label: 'Cancel',
						onClick: () => console.log('Click No')
					},
					{
						label: 'Delete',
						onClick: () => {
							this.props.deleteUser(id);	
			          	}
					}					
				]
			});				
		} else if (action === 'CLOSE') { // close
			this.setState({
				userAction: action,
				showUserModel: false
			});
		}
	};
	
	select = (value) => {
		this.setState({ type : value }, ()=> {
			if(value === 'Users'){
				this.props.getUsers();
			};
		})
	};

	handleClose	=	()	=> {
		this.setState({
			show: false
		})
	};

	componentWillReceiveProps(props) {    
        if(props.isUserUpdating && props.isUserUpdating !== this.props.isUserUpdating){
         	this.handleShowUserModel('CLOSE');
        };
    };

	render() {
		const { userType } = this.props;		
		const { type, showUserModel, userAction, initialUserData, initialUserErrorData } = this.state;
		return (
			<main className="dash right_sec settingp">
			 	<section className="con_top">
				 	{
				 		(userType && userType === 'admin')?
			 			<ul className="settingtmenu">
							<li className={(type === 'General') ? 'active' : ''} onClick={() => this.select('General')}><img src="/assets/general_ico.svg" alt="Stores" /> General</li>
							<li className={(type === 'Users') ? 'active' : ''} onClick={() => this.select('Users')}><img src="/assets/useres_ico.svg" alt="Stores" /> Users</li>
							<li className={(type === 'Stores') ? 'active' : ''} onClick={() => this.select('Stores')}><img src="/assets/stores_ico.svg" alt="Stores" /> Stores</li>
						</ul>
						:
						<ul className="settingtmenu">
							<li className={(type === 'General') ? 'active' : ''} onClick={() => this.select('General')}><img src="/assets/general_ico.svg" alt="Stores" /> General</li>
						</ul>
				 	}					

					{
						 (this.state.type === 'Stores') ?
						<button onClick={this.handleShowLocation} type="button" className="btn btn_blue userbtn">Add Store <img src="/assets/plus.svg" alt="" /></button>
						: null 
					}
					{
						(this.state.type === 'Users') ?
						<button onClick={()=>{ this.handleShowUserModel('ADD') }} type="button" className="btn btn_blue userbtn">Add User <img src="/assets/plus.svg" alt="" /></button>
						: null
					}

					<AddLocation
						show			=	{this.state.show}
						handleClose		=	{this.handleClose}
						isProcessing	=	{this.props.isLocProcessing}
						addLocation		=	{this.props.addLocation}
					/>

					<AddUserModal action={userAction} isUserUpdating={this.props.isUserUpdating} addUserData={this.props.addUser} updateUserData={this.props.editUser} show={showUserModel} handleShowUserModel={this.handleShowUserModel} initialData={initialUserData} initialUserErrorData={initialUserErrorData} />
				</section>
				<section className="setting_wrap">
					{
						(this.state.type === 'General') ?						
						<div className="general_pan">
							<Profile
								profileData			=	{this.props.profileData}
								isProcessing		=	{this.props.isProcessing}
								updateProfile		=	{this.props.updateProfile}
								getInfo				=	{this.props.getInfo}
							/>
							<ChangePassword
								isProcessing		=	{this.props.isPassProcessing}
								changePassword		=	{this.props.changePassword}
							/>
						</div>
						: null
					}
					{
						(this.state.type === 'Users') ?
						<Users action={userAction} isLoading={this.props.isUserLoading} usersList={this.props.usersList} handleShowUserModel={this.handleShowUserModel} />
						: null
					}
					{
						(this.state.type === 'Stores') ?
						<Stores
							isLoading		=	{this.props.isStoreLoading}
							isProcessing	=	{this.props.isStoreProcessing}
							storesList		=	{this.props.storesList}
							getStores		=	{this.props.getStores}
							editStore		=	{this.props.editStore}
							deleteStore		=	{this.props.deleteStore}
						/>
						: null
					}
				</section>
			</main>
		);
	};
};

export default withRouter(SettingComponent);