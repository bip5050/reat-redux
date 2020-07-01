import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Row, Col, Button } from 'reactstrap';
import {getDateTime} from '../../Helper/common';
import {getTaskStatus, getDeliveryWindow} from '../../util/helper';

class TaskDetailsModal extends Component {
 	constructor(props) {
        super(props);
        this.state = {        	
			orderDetailsModalShow: true
        }
    };

	componentWillReceiveProps(props) {
        this.setState({ orderDetailsModalShow: props.orderDetailsModalShow });
    }; 

	render() {
		const { orderDetailsModalShow } = this.state;
        let customerFeedback = (this.props.taskDetails && this.props.taskDetails.comment)?this.props.taskDetails.comment:'';
        let taskDetails = (this.props.taskDetails && this.props.taskDetails.order_details)?this.props.taskDetails.order_details:{};
        let responseToCustomer = (taskDetails.reply)?taskDetails.reply.message:null;

        let completionDetails = taskDetails.completionDetails || {};
        let events = completionDetails.events || {};
        
        let mrchnt_pics = events.onflt_mrchnt_pics || '';
        mrchnt_pics = (!!mrchnt_pics) ? mrchnt_pics.split(',') : [];

        let recpnt_pics = events.onflt_recpnt_pics || '';
        recpnt_pics = (!!recpnt_pics) ?recpnt_pics.split(',') : [];

        let recpnt_sig = events.onflt_recpnt_sig || '';
        let mrchnt_sig = events.onflt_mrchnt_sig || '';
        let path = 'https://d15p8tr8p0vffz.cloudfront.net/';
        const responsive = {
            superLargeDesktop: {
                // the naming can be any, depends on you.
                breakpoint: { max: 4000, min: 3000 },
                items: 5
            }, desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 2
            }, tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2
            },mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1
            }
        };

		return (
			<Modal size="md" className="c-modal nofooter" show={orderDetailsModalShow} onHide={this.props.handleCloseModal}>
	            <Modal.Header closeButton>
	                <Modal.Title>Task Details</Modal.Title>
	            </Modal.Header>

				<Modal.Body>
                    <Row noGutters>
                        <Col md="6" sm="12" className="l_col">
                            <div className="merchant_box">
                                <div className="detail_p">
                                    <p><label>Task ID:</label> {taskDetails.id}</p>
                                    <p><label>Task Status:</label> {getTaskStatus(taskDetails.tskStatus)}</p>
                                    <p><label>Delivery Window:</label> {getDeliveryWindow(taskDetails.completeAfter, taskDetails.completeBefore, taskDetails.time_zone)}</p>
                                    <p><label>Order Number:</label> {taskDetails.orderNumber}</p>
                                </div>
                            </div>
                            <div className="merchant_box">
                                <h4>Merchant info</h4>
                                {!!taskDetails.merchant ?
                                    <div className="detail_p">
                                        <p><label>Name:</label> <span>{taskDetails.merchant.name}</span>  </p>
                                        <p><label>Phone:</label><span>{taskDetails.merchant.phone}</span></p>
                                        <p><label>Address:</label><span>{taskDetails.merchant.address.number}, {taskDetails.merchant.address.street}, {taskDetails.merchant.address.postalCode}, {taskDetails.merchant.address.city}, {taskDetails.merchant.address.state}, {taskDetails.merchant.address.country}</span></p>
                                        <p><label>Notes:</label><span>{ taskDetails.merchant.notes} </span></p>
                                    </div>:null
                                }
                            </div>
                        </Col>
                        <Col md="6" sm="12" className="r_col">
                            <div className="merchant_box minH">
                                <h4>Recipient info</h4> 
                                {!!taskDetails.merchant ?
                                <div className="detail_p">
                                    <p><label>Name:</label> <span>{taskDetails.recipients.name}</span></p>
                                    <p><label>Phone:</label> <span>{taskDetails.recipients.phone}</span></p>
                                    {
                                        (!!taskDetails.recpnt_email) ?
                                        <p><label>Email:</label> <span>{taskDetails.recpnt_email}</span></p> : null
                                    }
                                    <p><label>Address:</label><span>{taskDetails.recipients.address.number}, {taskDetails.recipients.address.street}, {taskDetails.recipients.address.postalCode}, {taskDetails.recipients.address.city}, {taskDetails.recipients.address.state}, {taskDetails.recipients.address.country}</span></p>
                                    <p><label>Alochol:</label> <span>{taskDetails.alcohol}</span></p>
                                    <p><label>Tip: </label><span>{taskDetails.tip}</span></p>
                                    <p><label>Notes:</label> <span>{taskDetails.recipients.notes}</span></p>
                                </div>:null
                                } 
                            </div>
                        </Col>   
                    </Row>

                    <Row noGutters>
                        <Col md="12" sm="12" className="c_info task-d">
                            <div className="merchant_box">
                            <h4>Driver Details</h4>                            
                                <Row noGutters>
                                    <Col md="6" sm="12">
                                        <div className="detail_p">
                                            <p><label>Driver Name:</label> {taskDetails.driver_name}</p>
                                        </div>
                                    </Col>
                                </Row> 

                                <Row noGutters>
                                    <Col md="6" sm="12">
                                        <h6>Merchant Task</h6>
                                        <div className="detail_p">
                                        {
                                            (!!events.work_in_progress_timestamp) ?
                                            <p>
                                                <label>Order Processing:</label> 
                                                {getDateTime((events.work_in_progress_timestamp * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }
                                        {
                                            (!!events.ready_timestamp) ?
                                            <p>
                                                <label>Order Ready:</label> 
                                                {getDateTime((events.ready_timestamp * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }
                                        {
                                            (!!events.merchant_start) ?
                                            <p>
                                                <label>Start:</label> 
                                                {getDateTime((events.merchant_start * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }
                                        {
                                            (!!events.merchant_eta) ?
                                            <p>
                                                <label>2 min eta:</label> 
                                                {getDateTime((events.merchant_eta * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }
                                        {
                                            (!!events.merchant_arrival) ?
                                            <p>
                                                <label>Arrival:</label> 
                                                {getDateTime((events.merchant_arrival * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        } 
                                        {
                                            (!!events.merchant_complete) ?
                                            <p>
                                                <label>Complete:</label> 
                                                {getDateTime((events.merchant_complete * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }                                      
                                        {
                                            (!!events.merchant_worker_note) ?
                                            <p>
                                                <label>Complete:</label> 
                                                {events.merchant_worker_note}
                                            </p> : null
                                        }
                                        </div>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <h6>Recipient Task</h6>
                                        <div className="detail_p">
                                        {
                                            (!!events.recipient_start) ?
                                            <p>
                                                <label>Start:</label> 
                                                {getDateTime((events.recipient_start * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }
                                        {
                                            (!!events.recipient_eta) ?
                                            <p>
                                                <label>2 min eta:</label>
                                                {getDateTime((events.recipient_eta * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }
                                        {
                                            (!!events.recipient_arrival) ?
                                            <p>
                                                <label>Arrival:</label> 
                                                {getDateTime((events.recipient_arrival * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        } 
                                        {
                                            (!!events.recipient_complete) ?
                                            <p>
                                                <label>Complete:</label> 
                                                {getDateTime((events.recipient_complete * 1000), taskDetails.timezone, 'DD-MM-YYYY hh:mm A')}
                                            </p> : null
                                        }                                      
                                        {
                                            (!!events.recipient_worker_note) ?
                                            <p>
                                                <label>Complete:</label> 
                                                {events.recipient_worker_note}
                                            </p> : null
                                        }
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>

                    <Row noGutters className="sigPhotoRow">                         
                        <Col md="6" sm="12" className="l_col">
                            <div className="merchant_box sigbox">
                                <h4>Signature Details</h4> 
                                {
                                    (!!mrchnt_sig || !!recpnt_sig) ? 
                                    <Row noGutters>
                                        <Col md="6" sm="12">
                                            <h6>Merchant Signature</h6>
                                            { (!!mrchnt_sig) ? <img src={`${path}${mrchnt_sig}/282x.png`} /> : <p  className="noreply" > No response yet</p> }
                                        </Col>

                                        <Col md="6" sm="12" className="sigimg">
                                            <h6>Recipient Signature</h6>
                                            { (!!recpnt_sig) ? <img src={`${path}${recpnt_sig}/282x.png`} /> : <p  className="noreply" > No response yet</p> }
                                        </Col>
                                    </Row>:<p  className="noreply" > No response yet</p>
                                }
                            </div>
                        </Col>

                        <Col md="6" sm="12" className="r_col">
                            <div className="merchant_box dPhoto">
                                <h4>Delivery Photo</h4> 

                                {
                                    (recpnt_pics.length > 0 || mrchnt_pics > 0) ?
                                    <Carousel responsive={responsive}>
                                        {
                                            (mrchnt_pics || []).map((pic, i) => {
                                                return (
                                                    <div key={`mrchnt_pics_${i}`} className="pr16"><img src={`${path}${pic}/800x.png`} /></div>
                                                )
                                            })

                                            (recpnt_pics || []).map((pic, i) => {
                                                return (
                                                    <div key={`recpnt_pics_${i}`} className="pr16"><img src={`${path}${pic}/800x.png`} /></div>
                                                )
                                            })
                                        }                                   
                                    </Carousel>: <p  className="noreply" > No response yet</p>
                                }
                            </div>    
                        </Col>            
                    </Row> 

                    <Row noGutters>
                        <Col md="12" sm="12" className="c_info task-d">
                            <div className="merchant_box feedbackpan">
                                <h4>Feedback</h4>
                                <Row noGutters>
                                    <Col md="6" sm="12">
                                        <h6>Customer Feedback</h6>
                                        <p>{customerFeedback}</p>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <h6>Response to Customer </h6>
                                        {
                                            responseToCustomer?
                                            <p>{responseToCustomer}</p>:
                                            <p  className="noreply" > No response yet</p>
                                        }                                        
                                    </Col>
                                </Row>                                       
                            </div>
                        </Col>
                    </Row>                   
                </Modal.Body>	
	        </Modal>
		)
	};
};

export default TaskDetailsModal;