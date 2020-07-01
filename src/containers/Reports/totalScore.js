import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

class TotalScore extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	};

	render() {
		const { } = this.state;
		const { reportData } = this.props;
		let reportTotal = reportData.reportTotal || {};
		let chngTotOrdersPercent = reportTotal.chng_tot_orders_percent || 0;
		let chngShoppingLatePercent = reportTotal.chng_shopping_late_percent || 0;

		return (
			<div className="stats_Ubox mb24 dflex">
				<div className="uppan">
					<h4>Total Orders</h4>
					<h2>{reportTotal.total_orders}</h2>
					<p>
						{
							(chngTotOrdersPercent > 0)?
							<span className="gup">+{chngTotOrdersPercent.toFixed(2)}%</span>:null
						}

						{
							(chngTotOrdersPercent < 0)?
							<span className="rdown">{chngTotOrdersPercent.toFixed(2)}%</span>:null
						}

						{
							(chngTotOrdersPercent === 0)?
							<span className="gup">+0%</span>:null
						}
					 	&nbsp; last 30 days
					</p>
				</div>
				{/*
				<div className="uppan">
					<h4>Total Revenue</h4>
					<h2>$80,812</h2>
					<p><span className="gup">+25%</span> last 30 days</p>
				</div>
				<div className="uppan">
					<h4>New Customers</h4>
					<h2>1,231</h2>
					<p><span className="gup">+50%</span> last 30 days</p>
				</div>
				*/}
				<div className="uppan">
					<h4>Shopped Late</h4>
					<h2>{(reportTotal.shopping_late_percent > 0)?reportTotal.shopping_late_percent.toFixed(2):0}%</h2>
					<p>
						{
							(chngShoppingLatePercent > 0)?
							<span className="rup">+{chngShoppingLatePercent.toFixed(2)}%</span>:null
						}

						{
							(chngShoppingLatePercent < 0)?
							<span className="gdown">{chngShoppingLatePercent.toFixed(2)}%</span>:null
						}

						{
							(chngShoppingLatePercent === 0)?
							<span className="gup">+0%</span>:null
						}
					 	&nbsp; last 30 days
					</p>
				</div>																		
			</div>
		);
	};
};

export default TotalScore;