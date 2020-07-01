import React, { Component } from 'react';
import moment from 'moment-timezone';
import { Row, Col } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';

import {groupBy as _groupBy} from 'lodash';
import 'zingchart/es6';
import ZingChart from 'zingchart-react';
import 'zingchart-react/dist/modules/zingchart-depth.min.js';

class MonthlyView extends Component {
	constructor(props) {
		super(props);		
	};

	render() {
		const { reportData } = this.props;
		let ordersData = (reportData.ordersData && reportData.ordersData.orders)?reportData.ordersData.orders:[];

		let totalOrder = 0;
		let monthNameArray = [];	
		let monthlyTotalOrderArray = [];

		let orderGrpedArray = _groupBy(ordersData, function(order) { return moment(order.D).format("MMM 'YY")});
		Object.keys(orderGrpedArray).forEach(function(key) {
			let orderObj = orderGrpedArray[key] || [];

			monthNameArray.push(key);

			let monthlyOrder = 0;
			orderObj.map(order => {
				totalOrder += parseFloat(order.order_count);
				monthlyOrder += parseFloat(order.order_count);
			});

			monthlyTotalOrderArray.push(monthlyOrder);
		});

		const config = {
			type: "area",
			scaleY: {
				"guide": {
					"line-style": "dashed",
				}
			},
			scaleX: {
				"max-labels": 12,
				labels: monthNameArray
			},
			plot: {
				tooltip: {
					"font-family": "Source Sans Pro",
					"font-size": "16px",
					"line-height": "18px",
					"font-weight": "600",
					"text": "%v orders <br><span style='font-weight: 600; font-size: 14px; line-height: 18px; letter-spacing: 0.1em; color:#B6B6B6'>%data-days</span>",
					"text-align": "center",
					"border-radius": 4,
					"padding": "8px 16px",
					"background-color": "#fff",
					"color": "#545454",
					"box-shadow": "0px 1px 5px rgba(0, 0, 0, 0.1)",
					"border":"1px solid #E0E0E0",
					"callout": true
			  	}
			},
			series: [{
				values: monthlyTotalOrderArray,
				"data-days": monthNameArray
			}]
		};

		return (
			<div className="ariachart">
				<ZingChart data={config}/>
			</div>	
		);
	};
};

export default MonthlyView;