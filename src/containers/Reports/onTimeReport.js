import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import LateOrdersModal from '../Modals/lateOrdersModal';
//import OrderDetails from './orderDetailsModal';

class OnTimeReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLateOrderModal: false,
			//detailsShow       :   false
		};
	};

	/* openDetailsWindow = (uuid) => {
		this.props.getTaskDetails({uuid: uuid})
		this.setState({
		   detailsShow: true
		})
	 } */ 

	handleCloseModal(){
		this.setState({ showLateOrderModal: false });
	};

	handleOpenModal = (e) => {
		e.stopPropagation();
		this.setState({ showLateOrderModal: true });
		this.props.getLateOrders();
	};

	render() {
		const { showLateOrderModal } = this.state;
		const { reportData, startDate, endDate } = this.props;
		let reportTotal = reportData.reportTotal || {};
		return (
			<Col md="6" sm="12" className="pl10">
				<div className="stats_box">
					<h3 className="sec_titel">On Time Report</h3>
					<div className="otrWrap">
						<div className="otrInfo">
							<h4>Total Orders</h4>
							<h2>{reportTotal.total_orders}</h2>

							<div className="toWrap">
								<div className="otrData otRound">
									<div className="ortlabel"><span>On Time</span> {reportTotal.on_time_percentage}%</div>
									<div className="ortText">{reportTotal.total_orders - reportTotal.late_orders} Responses</div>
								</div>

								<div className="otrData lateRound">
									<div className="ortlabel"><span>Late</span>  {reportTotal.late_percentage}%</div>
									<div className="ortText">{reportTotal.late_orders} Responses</div>
								</div>
							</div>

							<a className="vlOrder" style={{cursor: 'pointer'}} onClick = {(e)=>this.handleOpenModal(e)}>View Late Orders</a>
						</div>

						<div className="otrChart">
							<div className="chart_wrap">
								<svg viewBox="0 0 36 36" className="circular-chart orange_c">
									<path className="circle-bg"
									d="M18 2.0845
										a 15.9155 15.9155 0 0 1 0 31.831
										a 15.9155 15.9155 0 0 1 0 -31.831"
									/>
									<path className="circle"
									strokeDasharray={`${reportTotal.on_time_percentage}, ${reportTotal.late_percentage}`}
									d="M18 2.0845
										a 15.9155 15.9155 0 0 1 0 31.831
										a 15.9155 15.9155 0 0 1 0 -31.831"
									/>
								</svg>

								<span className="cText">{reportTotal.on_time_percentage}%<span>On Time</span></span>
							</div>										
						</div>
					</div>
				</div>

				{
					(!!showLateOrderModal) ?
					<LateOrdersModal
						showLateOrderModal={showLateOrderModal}
						handleCloseModal={this.handleCloseModal.bind(this)}
						lateOrder={this.props.lateOrder}
						getLateOrders={this.props.getLateOrders}
						getTaskDetails={this.props.getTaskDetails}
						taskDetails={this.props.taskDetails}
						sortLateOrders={this.props.sortLateOrders}
						isLoading={this.props.isLoading}
						pageChangeLateOrders={this.props.pageChangeLateOrders}
					/> : null
				} 
				
				{
					/* (!!this.state.detailsShow) ?
					<OrderDetails
						show                =   {this.state.detailsShow}
						taskDetails         =   {this.props.taskDetails}
						handleClose         =   {this.handleClose}
					/> : null */
				} 
				
			</Col>			
		);
	};
};

export default OnTimeReport;