import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment-timezone';
import {isEqual} from 'lodash';

class DailyView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.maxOrders		=	0
	};

	componentDidMount() {
		//let { ordersData  }	=	this.props.reportData;
		//console.log('Did Mount : ', this.props.reportData);
		let { reportData, showBy  }	=	this.props;
		let ordersData				=	(!!reportData) ? reportData.ordersData : {};
		this.arrangeGraphData(ordersData, showBy);
	}

	componentWillReceiveProps(props) {
		//console.log('Will Receive Props : ', props.reportData, this.props.reportData);
		if(props.showBy !== this.props.showBy || !isEqual(props.reportData, this.props.reportData)){
			let { reportData, showBy  }	=	props;
			let ordersData				=	(!!reportData) ? reportData.ordersData : {};
			this.arrangeGraphData(ordersData, showBy);
		}
		/* console.log('Daily Props : ', this.props, props);
		let { reportData, showBy  }	=	props;
		let ordersData				=	(!!reportData) ? reportData.ordersData : {};
		this.arrangeGraphData(ordersData, showBy); */
		/*let { reportData }	=	props;
		console.log('Daily Graph Data'); */
	}

	arrangeGraphData(ordersData, showBy) {		
		//console.log('showBy : ', showBy);
		if(!!ordersData && !!ordersData.orders) {
			let orderList		=	ordersData.orders || [];
			let maxOrders		=	this.maxOrders;
			//maxOrders			=	Math.ceil(Math.max(...orderList.map(item => item.order_count))/500) * 500;
			maxOrders			=	Math.max(...orderList.map(item => item.order_count));
			maxOrders			=	Math.ceil(maxOrders/6)*6;
			//console.log('Max', maxOrders);
			//console.log('Show by ', showBy);
			let dailyArr		=	[];
			if(showBy === 'date') {
				dailyArr				=	orderList.map((item) => {
					let formattedDate	=	(!!item.D) ? moment(item.D, 'YYYYMMDD').format('MMM DD') : '';
					return {
						...item,
						label: formattedDate,
						percentage: (item.order_count * 100)/maxOrders
					}
				})
			}
			if(showBy === 'store') {
				dailyArr				=	orderList.map((item) => {
					let addrArr			=	(item.address || '').split(',');
					addrArr.splice(addrArr.length - 2, 2);
					let address			=	addrArr.join(', ');
					//console.log('Address : ', addrArr, address);
					return {
						...item,
						label: address,
						percentage: (item.order_count * 100)/maxOrders
					}
				})
			}
			let slab		=	(maxOrders > 0)? maxOrders/6 : 0;
			let slabArr		=	[];
			let count		=	0;
			for(let i=0; i<=6; i++){
				slabArr.push(count);
				count		=	count + parseInt(slab);
			}
			this.setState({
				dailyArr : dailyArr,
				slabArr : slabArr
			})
		}
	}

	render() {
		const { dailyArr, slabArr } = this.state;
		//console.log(dailyArr);
		return (
			<div className="resscroll">
				<div className="cLabel">
					<div className="fcol">{(this.props.showBy === 'date') ? 'Date' : 'Stores'}</div>
					<div className="mcol"></div>
					<div className="lcol">Value</div>
				</div>
				<div className="cval">
					<div className="scrollpan">
						{
							(!!dailyArr && dailyArr.length > 0) ?
							<Scrollbars>
								{
									dailyArr.map((item, k) => {
										return (
											<div key={k} className="cValueRow">
												<div className="fcol">{item.label}</div>
												<div className="mcol"><span className="hBar" style={{width: `${item.percentage}%`}}></span></div>
												<div className="lcol">{item.order_count}</div>
											</div>
										)
									})
								}
								{/* <div className="cValueRow">
									<div className="fcol">May 19</div>
									<div className="mcol"><span className="hBar" style={{width: '100%'}}></span></div>
									<div className="lcol">2,503</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 18</div>
									<div className="mcol"><span className="hBar" style={{width: '80%'}}></span></div>
									<div className="lcol">2,403</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 17</div>
									<div className="mcol"><span className="hBar" style={{width: '85%'}}></span></div>
									<div className="lcol">2,331</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 16</div>
									<div className="mcol"><span className="hBar" style={{width: '60%'}}></span></div>
									<div className="lcol">2,031</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 15</div>
									<div className="mcol"><span className="hBar" style={{width: '75%'}}></span></div>
									<div className="lcol">2,435</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 14</div>
									<div className="mcol"><span className="hBar" style={{width: '99.5%'}}></span></div>
									<div className="lcol">2,499</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 13</div>
									<div className="mcol"><span className="hBar" style={{width: '50%'}}></span></div>
									<div className="lcol">1,314</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 12</div>
									<div className="mcol"><span className="hBar" style={{width: '85%'}}></span></div>
									<div className="lcol">2,331</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 11</div>
									<div className="mcol"><span className="hBar" style={{width: '60%'}}></span></div>
									<div className="lcol">2,031</div>
								</div>
								<div className="cValueRow">
									<div className="fcol">May 10</div>
									<div className="mcol"><span className="hBar" style={{width: '75%'}}></span></div>
									<div className="lcol">2,435</div>
								</div>	
								<div className="cValueRow">
									<div className="fcol">May 9</div>
									<div className="mcol"><span className="hBar" style={{width: '75%'}}></span></div>
									<div className="lcol">2,435</div>
								</div> */}
							</Scrollbars>
							: null	
						}
					</div>
					
					<div className="cGrid">
						{
							(!!slabArr && slabArr.length > 0) ?								
							<div className="mcol">
								{
									slabArr.map((item, i) => {
										return (
										<span key={i}>{item}</span>
										)
									})
								}
								{/* <span>0</span>
								<span>500</span>
								<span>1000</span>
								<span>1500</span>
								<span>2000</span>
								<span>2500</span> */}
							</div> : null
						}
					</div>
				</div>
			</div>	
		);
	};
};

export default DailyView;