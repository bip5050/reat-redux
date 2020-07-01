import moment from 'moment-timezone';
import ReplyModal from './replyModal';
import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Pagination from '../../Helper/pagination';
import TaskDetailsModal from './taskDetailsModal';
import { isEmpty, isEqual, map as _map } from 'lodash';
import { avgCustomerFeedback } from '../../Helper/common';

class List extends Component {
 	constructor(props) {
        super(props);
        this.state = {     
        	taskDetails:{},	   
        	repliedIds: [], 
			replyModalShow: false,
        	filteredFeedbackData: [],	
			orderDetailsModalShow: false
        }
    };

	handleCloseModal(){
		this.setState({ replyModalShow: false, orderDetailsModalShow: false });
	};

	handleOpenModal(e, type, ordObj){
		e.stopPropagation();
		
		if(type === 'REPLY'){
			this.setState({ replyModalShow: true, taskDetails: ordObj });
		} else if(type === 'ORDERDETAILS'){
			this.setState({ orderDetailsModalShow: true, taskDetails: ordObj });
		}
	};

	componentWillReceiveProps(props) {
		if(props.replyResult && props.replyResult !== this.props.replyResult){
			let repliedIds = this.state.repliedIds || [];
            repliedIds.push(props.replyResult.task_id);

			this.setState({ replyModalShow: false, orderDetailsModalShow: false, repliedIds: repliedIds });
		}

		this.setState({ filteredFeedbackData: props.filteredFeedbackData });
    }; 	

	render() {
		const { replyModalShow, orderDetailsModalShow, taskDetails, repliedIds, filteredFeedbackData } = this.state;
		let totalFeedBack = (this.props.feedbackSummeryData && this.props.feedbackSummeryData.total_feedback)?this.props.feedbackSummeryData.total_feedback:0; 
		let feedbackSummery = (this.props.feedbackSummeryData && this.props.feedbackSummeryData.rows)?this.props.feedbackSummeryData.rows:[]; 

		//pagination start here
		let itemsPerPage = 500;
		let totalRecords = this.props.feedBackCount || 0;

		let avgRating = 0;
		let ratingPrcnt = 0;
		let totalRatingPrcnt = 0;

		feedbackSummery.map((el, index) => {
			totalRatingPrcnt += (parseFloat(el.percentage));
			ratingPrcnt += (parseFloat(el.rating) * parseFloat(el.percentage));
		});

		avgRating = parseFloat(ratingPrcnt / totalRatingPrcnt);

		let avgStarObj = [];
		let avgStarObj1 = [];
		let avgRatingObj = avgCustomerFeedback(avgRating);

		for(let s=1; s<=avgRatingObj.newwhole; s++){
			let key = "star-"+s;
			avgStarObj.push(<img key={key} src="/assets/star.svg" />);
		};

		if(avgRatingObj.fraction==.5){
			avgStarObj.push(<img key="star-h" src="/assets/star-h.svg" />);
		};

		for(let s=1; s <= (5 - avgStarObj.length); s++){
			let key = "star-g-"+s;
			avgStarObj1.push(<img key={key} src="/assets/star-g.svg" />);
		};

		// console.log('!!!!repliedIds!!!!!', repliedIds);

		return (
			<div>
				{
                    (!!!this.props.isLoading)?
                    <div>                    	              			
						<section className="feedback_wrap">
							<h4 className="titelFb">Customer Feedback</h4>

							{
								(feedbackSummery.length > 0)?
								<div className="fbSecwrap">
									<div className="bstarPan">
										<div className="bstar_up">
											<h3>{(avgRating > 0)?avgRating.toFixed(2):0}</h3>
											<span className="big_star">{avgStarObj}{avgStarObj1}</span>
										</div>

										<div className="bstar_down">based on {totalFeedBack} ratings</div>

										
									</div>

									<div className="statsbarPan">
										{											
											feedbackSummery.map((el, index) => {
												return (
													<div key={`rate-${index}`} className="gBar">
														<label>{el.rating} Stars</label>
														<div className="bar"><ProgressBar now={el.percentage} /></div>
														<span className="totalP">{el.feedback_count} Total</span>
													</div>
												)
											})
										}
									</div>
								</div>:null
							}

							<div className="filter_pan">
								<span className="ftitle">Filter by:</span>
								<div className="cbPan">
									<input onChange={this.props.handleCheckboxFilter} checked={this.props.allRatings} type="checkbox" id="rating" name="rating" value="all" className="c_box" /> <span className="fwb">All ratings</span>
								</div>

								<div className="cbPan">
									<input onChange={this.props.handleCheckboxFilter} checked={(this.props.filterByStart.includes('5'))} type="checkbox" id="rating" name="rating" value="5" className="c_box" /> <span>5 Stars</span>
								</div>

								<div className="cbPan">
									<input onChange={this.props.handleCheckboxFilter} checked={(this.props.filterByStart.includes('4'))} type="checkbox" id="rating" name="rating" value="4" className="c_box" /> <span>4 Stars</span>
								</div>

								<div className="cbPan">
									<input onChange={this.props.handleCheckboxFilter} checked={(this.props.filterByStart.includes('3'))} type="checkbox" id="rating" name="rating" value="3" className="c_box" /> <span>3 Stars</span>
								</div>

								<div className="cbPan">
									<input onChange={this.props.handleCheckboxFilter} checked={(this.props.filterByStart.includes('2'))} type="checkbox" id="rating" name="rating" value="2" className="c_box" /> <span>2 Stars</span>
								</div>

								<div className="cbPan">
									<input onChange={this.props.handleCheckboxFilter} checked={(this.props.filterByStart.includes('1'))} type="checkbox" id="rating" name="rating" value="1" className="c_box" /> <span>1 Stars</span>
								</div>
							</div>

							<div className={`table_sec feed feedbackTable ${this.props.isFiltering ? "tableloder":""} `}>
								<table>
									<thead>
										<tr>
											<th>Order Number</th>
											<th>Customer Name</th>
											<th>Date · Time</th>
											<th>Rating</th>
											<th>Comments</th>
											<th>Follow Up</th>
										</tr>
									</thead>

									{
									 	(!isEmpty(filteredFeedbackData) && filteredFeedbackData.length > 0) ? 
										<tbody>
											{
												(filteredFeedbackData.length > 0) && filteredFeedbackData.map((el, index) => {
													let starObj = [];
													let rate = (el.rating)?parseInt(el.rating):0;
													
													for (let i = 0; i < rate; i++) {
														starObj.push(<img key={`star-sm-${i}`} src="/assets/star-sm.svg" />);
													}

													// let date = moment(el.time_stamp).format("YYYY-MM-DD");
													return (
														<tr key={`feedback-list-${index}`}>
															<td>{el.tp_order_number} <span className="docmodbtn" onClick={(e)  => this.handleOpenModal(e, 'ORDERDETAILS', el)}><img src="/assets/doc.svg" /></span></td>
															<td>{el.cust_first_name} {el.cust_last_name}</td>
															<td>{el.time_stamp}</td>
															<td><div className="starRange">{starObj}</div></td>
														 	<td abbr="tr" className="acell">
															 	<label>{el.comment}</label> 
															 	{
														 			(el.comment)?
															 		<span className="tTip">{el.comment}</span>:null
															 	}
														 	</td>
															<td>
																{
																	(el.reply === "true" || (repliedIds.indexOf(el.order_details.id) > -1) )?
																	<span className="fbReply" style={{cursor: 'default'}}><img src="/assets/checkmark-black.svg" /></span>
																	:
																	<span className="fbReply" onClick={(e)  => this.handleOpenModal(e, 'REPLY', el)}>Reply</span>
																}	
															</td>
														</tr>	
													)
												})
											}											
										</tbody>
										:<tbody><tr className="no-records"><td colSpan="6">No Records</td></tr></tbody> 
									}
								</table>
							</div>							

							{
								(!!replyModalShow) ?
								<ReplyModal reply={this.props.reply} isReplying={this.props.isReplying} replyModalShow={replyModalShow} handleCloseModal={this.handleCloseModal.bind(this)} taskDetails={taskDetails} /> : null
							} 

							{
								(!!orderDetailsModalShow) ?
								<TaskDetailsModal isReplying={this.props.isReplying} orderDetailsModalShow={orderDetailsModalShow} handleCloseModal={this.handleCloseModal.bind(this)} taskDetails={taskDetails} /> : null
							} 
			        	</section>	
			        	
			        	{
							totalRecords >= itemsPerPage ?
							<div className="pagination_Pan"><Pagination totalRecords={totalRecords} pageLimit={itemsPerPage} pageNeighbours={1} onPageChanged={this.props.changePage} /></div>:null
	                  	}			        	
		        	</div> : <div className="loader">Loading....</div>
		        }
        	</div>       	
		)
	};
};

export default List;