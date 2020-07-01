import Reruns from './reruns';
import DailyView from './dailyView';
import TotalScore from './totalScore';
import MonthlyView from './monthlyView';
import OnTimeReport from './onTimeReport';
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';

import 'zingchart/es6';
import ZingChart from 'zingchart-react';
import 'zingchart-react/dist/modules/zingchart-depth.min.js';

class ReportGrid extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 'Daily',
			optOpen: false,
			showBy: 'date',
			showByTxt: 'Show by Date'
		};
	};

	select = (value) => {
		this.setState({ type : value }, function(){
			this.getOrder();
		});
	};

	onChangeHandle(e) {
		if(e === 'date'){
			this.setState({ showBy: e, showByTxt: 'Show by Date', optOpen: !this.state.optOpen }, function(){
				this.getOrder();
			});
		} else {
			this.setState({ showBy: e, showByTxt: 'Show by Store', optOpen: !this.state.optOpen }, function(){
				this.getOrder();
			});
		}
	};

	handleSelectbox(type) {		
		this.setState({ optOpen: !this.state.optOpen });
	};

	handleOutsideClick = (e) => {
		e.stopPropagation();

		if(this.nodeState.contains(e.target) || e.target.getAttribute('data') === 'ignore-outer-click'){ 
			return;  
		};

		if(!!this.state.optOpen) { 
			this.setState({ optOpen: false}); 
		};
  	};

	componentDidMount() {
		let showBy		=	this.props.showBy;		
		let showByTxt	=	this.state.showByTxt;
		let type		=	(showBy === 'month') ? 'Monthly' : 'Daily';
		if(showBy === 'month'){			
			showBy		=	'date';	
			showByTxt	=	'Show by Date';
		}	else {				
			showByTxt	=	(showBy === 'date') ? 'Show by Date' : 'Show by Store';
		}
		this.setState({
			type		:	type,
			showBy		:	showBy,
			showByTxt	:	showByTxt
		})
  		document.addEventListener('click', this.handleOutsideClick);
  	};

	componentWillUnmount() {
		document.removeEventListener('click', this.handleOutsideClick);
	};

	getOrder = () => {		
		let showBy	=	'';
		if(this.state.type === 'Monthly') {
			showBy	=	'month';
		} else {
			showBy	=	this.state.showBy;
		}
		this.props.getOrder(showBy);
	}

	render() {
		const { type, optOpen, showBy, showByTxt } = this.state;
		//console.log(showByTxt);
		return (
			<section className="content">
				<TotalScore reportData={this.props.reportData} />				

				<div className="stats_box mb24">
					<div className="barchartPan">
						<div className="bcpTop">
							<div className="lcol">Orders</div>
							<div className="rcol">
								<span onClick={() => this.select('Daily')} className={(type === 'Daily') ? 'active' : ''}>Daily View</span>
								<span onClick={() => this.select('Monthly')} className={(type === 'Monthly') ? 'active' : ''}>Monthly View</span>
							</div>

							{
								(type === 'Monthly') ?
								<div className="dropPan">
									<div ref={nodeState => this.nodeState = nodeState} className="mText">Last 12 months</div>
								</div>
								:
								<div className="dropPan">
									<div ref={nodeState => this.nodeState = nodeState} className={`select-box${optOpen ? " sopen" : " "}`}>
										<div className="s-result" onClick={() => this.handleSelectbox(type)}>
											<div className="sVal">{showByTxt}</div>
										</div>

										<ul>
											<li onClick={() => this.onChangeHandle('date')} data='ignore-outer-click' className={(showBy === 'date') ? 'active' : ''}>Show by Date</li>
											<li onClick={() => this.onChangeHandle('store')} data='ignore-outer-click' className={(showBy === 'store') ? 'active' : ''}>Show by Store</li>
										</ul>
									</div>
								</div>	
							}						
						</div>
						{
							(!this.props.isOrderLoading) ?
							<div className={`bcpButtom${(showBy === 'store') ? ' byStore': ''}`}>
								{
									(type === 'Daily') ?
									<DailyView reportData={this.props.reportData} showBy={showBy}/>:null
								}
	
								{
									(type === 'Monthly') ?
									<MonthlyView reportData={this.props.reportData} />:null
								}					
							</div> : <div className="loader"></div>
						}							
					</div>
				</div>

				<Row noGutters>
            		<Reruns reportData={this.props.reportData} />
            		<OnTimeReport
						startDate={this.props.startDate}
						endDate={this.props.endDate}
						reportData={this.props.reportData}
						isLoading={this.props.isLateOrderLoading}
						getLateOrders={this.props.getLateOrders}
						lateOrder={this.props.lateOrder}						
						getTaskDetails={this.props.getTaskDetails}
						taskDetails={this.props.taskDetails}
						sortLateOrders={this.props.sortLateOrders}
						pageChangeLateOrders={this.props.pageChangeLateOrders}
					/>
				</Row>
			</section>
		);
	};
};

export default ReportGrid;