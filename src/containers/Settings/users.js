import React, { Component } from 'react';
import moment from 'moment-timezone';
import CustomContext from './userContextMenu';

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {	
			x: '',
			y: '',		
			itemObj: null,
			visible: false
		};

		this.handleContextMenu = this.handleContextMenu.bind(this);
	};

	handleContextMenu(event, itemObj) {
		let self = this;
		event.preventDefault();        
		const clickX =  event.clientX;
		const clickY =  event.pageY;
		self.setState({
			visible     :  true,
			x           :  clickX,
			y           :  clickY,
			itemObj     :  itemObj
		});
	};

	hideContextMenu = () => {
		this.setState({
			visible     :  false,
			x:0,
			y:0
		});
	};

    render() {
    	let userObj = this.props.usersList || {};
    	let userCount = userObj.count || 0;
    	let activeUserCount = userObj.active_count || 0;
    	let inActiveUserCount = userObj.inactive_count || 0;
    	let users = (userObj && userObj.users) || [];

        return (
			<div className="users_pan">
				<CustomContext
					visible             =   {this.state.visible}
					x                   =   {this.state.x}
					y                   =   {this.state.y}
					itemObj             =   {this.state.itemObj}				
					hideContextMenu     =   {this.hideContextMenu}
					handleShowUserModel =   {this.props.handleShowUserModel}
				/>

				<div className="table_sec">
				{
					(!this.props.isLoading)?
					<div>
						<table>
						 	<thead>
								<tr>
									<th colSpan="6" className="t-titel">
										<div className="status_count">
											<span className="g_total">Total Users: {userCount}</span>
											<span className="g_users">Active Users: {activeUserCount}</span>
											<span className="g_users">Suspended Users: {inActiveUserCount}</span>
										</div>
									</th>
								</tr>
						 	</thead>

						 	<tbody>
								<tr className="t-heading">
									<th>First Name</th>
									<th>Last Name</th>
									<th>Email</th>
									<th style={{textAlign: 'left'}}>Last Login: Date/Time</th>
									<th>User Type</th>
									<th>Suspended</th>
								</tr>

								{
									(users.length > 0) ?
										users.map((item, index) => {
											let date = moment(item.created_at).format("MM/DD - hh:mma");

											return (
												<tr key={index} className={(item.active === 'false') ? 'dis' : ''} onContextMenu={(e) => this.handleContextMenu(e, item)}>
													<td>{item.first_name}</td>
													<td>{item.last_name}</td>
													<td>{item.email}</td>
													<td style={{textAlign: 'left'}}>{date}</td>
													<td style={{textTransform: 'capitalize'}}>{item.user_type}</td>
													<td>{(item.active === 'true') ? 'False' : 'True'}</td>
												</tr>
											)
										})
									: <tr className="no-records"><td style={{textAlign:"center"}} colSpan="6">No Records</td></tr>
								}
							</tbody>																
						</table>							
					</div>
					: <div className="loader">Loading....</div>
				}
				</div>
			</div>
        )
    };
};