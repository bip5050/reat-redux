import React, { Component } from 'react';
import CustomContext from './contextMenu';
import EditLocation from '../Modals/editLocation';
export default class Stores extends Component {
    constructor(props) {
		super(props);
		this.state		=	{			
			visible         :   false,
			x               :   '',
			y               :   '',
			store			:	{},
			selStore		:	{}
		}
	}

	componentDidMount() {
		this.props.getStores();
	}

	handleContextMenu = (e, item) => {
		e.preventDefault();
        const clickX               =  e.clientX;
        const clickY               =  e.pageY;
        this.setState({
            visible     :  true,
            x           :  clickX,
            y           :  clickY,
            store    	:  item
        });
	}

	hideContextMenu	=	() => {
        this.setState({
            visible :   false,
            x       :   0,
			y       :   0,
			store	:	''
        });
	}

	/* handleShowLocation	= () => {
		this.setState({
			show: true
		})
	}; */

	editStore = (store) => {
		//console.log('Edit Store : ', id);
		this.setState({
			show		:	true,
			selStore	:	store
		})
	}

	deleteStore = (id) => {
		if(window.confirm('Do you really want to delete this store?')) {
			this.props.deleteStore(id);	
		}
	}

	handleClose	=	()	=> {
		this.setState({
			show: false
		})
	};

    render() {
		let stores			=	this.props.storesList || [];
        return (
			<div className="stores_pan">
				<div className="table_sec">
					{
						(!this.props.isLoading) ?
						<table>
							<thead>
							<tr>
								
								<th colSpan="4" className="t-titel">
									<div className="status_count">
										<span className="g_total">Total Stores: {stores.length}</span>
									</div>
								</th>
							</tr>
							</thead>
							<tbody>
							<tr className="t-heading">
								<th>Store</th>
								<th>Address</th>
								<th>Phone</th>
								<th>Notes</th>
							</tr>
							{
								(stores.length > 0) ?
								stores.map((item, i) => {
									return (
										<tr key={i} onContextMenu={(e) => this.handleContextMenu(e, item)}>
											<td>{item.store}</td>
											<td className="acell"><label>{item.address}</label><span className="tTip">{item.address}</span></td>
											<td>{item.phone}</td>
											<td className="acell"> {(item.note) ? <span className="tTip">{item.note}</span> : ''} <label>{item.note}</label></td>
										</tr>
									)
								})
								: <tr className="no-records"><td style={{textAlign:"center"}} colSpan="4">No Records</td></tr>
							}
							</tbody>
						</table>
						: <div className="loader">Loading....</div>
					}
				</div>
				<CustomContext
                    visible             =   {this.state.visible}
                    x                   =   {this.state.x}
                    y                   =   {this.state.y}
                    store            	=   {this.state.store}
                    edit				=   {this.editStore}
                    delete				=   {this.deleteStore}
                    hideContextMenu     =   {this.hideContextMenu}
                />
				<EditLocation
					show			=	{this.state.show}
					handleClose		=	{this.handleClose}
					isProcessing	=	{this.props.isProcessing}
					editStore		=	{this.props.editStore}
					selStore		=	{this.state.selStore}
				/>					
			</div>
        )
    }
}