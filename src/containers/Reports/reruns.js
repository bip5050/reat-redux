import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';

class Reruns extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	};

	render() {
		const { } = this.state;
		const { reportData } = this.props;
		let rerunData = reportData.rerunData || {};		
		let reRunOrders = rerunData.rerun || [];
		let chngRerunTotalPercent = rerunData.chng_rerun_total_percent || 0;

		return (
			<Col md="6" sm="12" className="pr10">
				<div className="stats_box">
					<h3 className="sec_titel">Reruns</h3>
					<div className="rwrap">
						<div className="rinfo">
							<h4>Total Reruns</h4>
							<h2>{rerunData.total_rerun || 0}</h2>
							<p>
								{
									(chngRerunTotalPercent > 0)?
									<span className="rup">+{chngRerunTotalPercent.toFixed(2)}%</span>:null
								}

								{
									(chngRerunTotalPercent < 0)?
									<span className="gdown">{chngRerunTotalPercent.toFixed(2)}%</span>:null
								}

								{
									(chngRerunTotalPercent === 0)?
									<span className="gup">+0%</span>:null
								}
							 	&nbsp; last 30 days
							</p>
						</div>
						<div className="rtable">
							<div className="rtRow rtlabel">
								<span className="rtCol">Store ID</span>
								<span className="rtCol">Reruns</span>
							</div>

							<div className="rtDeta">
								<Scrollbars>
									{

										(reRunOrders || []).map((item, index) => {
											return (
						                        <div key={`state-tag-${index}`} className="rtRow">
													<span className="rtCol">{item.store_name} #{item.store_id}</span>
													<span className="rtCol">{item.order_count}</span>
												</div>
					                        )
										})
									}
								</Scrollbars>	
							</div>																																																																				
						</div>
					</div>
				</div>
			</Col>
		);
	};
};

export default Reruns;