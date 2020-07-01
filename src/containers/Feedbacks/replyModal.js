import moment from 'moment-timezone';
import {getCookie} from '../../util/cookies';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col, Form, Button } from 'reactstrap';
import {getDeliveryWindow} from '../../util/helper';
import { isEmpty, isEqual, map as _map } from 'lodash';

class ReplyModal extends Component {
 	constructor(props) {
        super(props);

        let email = (this.props.taskDetails && this.props.taskDetails.email)?this.props.taskDetails.email:"";

        this.state = {     
            fields: {
                to: email,
                message: ''
            },
            errors: {
                to: '',
                message: ''
            },   	
			replyModalShow: true
        }

        this.handleReply = this.handleReply.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    };

    handleValidation(){
        let isError = false;
        let fields = this.state.fields;
        let errors = this.state.errors;

        //To
        if(!!!fields.to){
            isError = true;
            errors.to = 'Email is required.';
        } else if(fields["to"]) {
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(!reg.test(fields.to)) {
                isError = true;
                errors.to = 'Please enter a valid email address.';
            }
        };

        //Message
        if(!!!fields.message){
            isError = true;
            errors.message = 'Message is required.';
        };

       this.setState({ errors: errors });
       return isError;
    };

    handleChange(e){    
        const { name, value } = e.target
        let fields = this.state.fields;
        fields[name] = value; 

        let errors = {...this.state.errors};
        errors[name] = "";
               
        this.setState({fields, errors: errors});
    };

    handleReply(e){
        e.preventDefault();
        let isError = this.handleValidation();

        if(isError) {
            return false;
            console.log("Form has errors.", this.state.errors);
        } else {
            let replyeData = {...this.state.fields};
            let taskDetails = this.props.taskDetails || {};
            let userData = getCookie('foodjets_merchant') || {};

            replyeData['from'] = userData.org_email;
            replyeData['last_name'] = taskDetails.cust_last_name;
            replyeData['task_id'] = taskDetails.order_details.id;
            replyeData['customer_message'] = taskDetails.comment;
            replyeData['first_name'] = taskDetails.cust_first_name;
            replyeData['order_number'] = taskDetails.tp_order_number;
            replyeData["subject"] = "Raleys Response to Order Number: "+taskDetails.tp_order_number;
            replyeData['complete_after'] = moment.tz(parseInt(taskDetails.order_details.completeAfter) * 1000, taskDetails.order_details.time_zone).format('MM/DD/YYYY hh:mm a');
            
            this.props.reply(replyeData);
        }
    };

	componentWillReceiveProps(props) {
        this.setState({ replyModalShow: props.replyModalShow });
    }; 

	render() {
        let starObj = [];
        let activeFormBtn = false;
		const { fields, errors, replyModalShow } = this.state;
        let taskDetails = this.props.taskDetails || {};
        let rate = (taskDetails && taskDetails.rating)?parseInt(taskDetails.rating):0;
        let customerName = taskDetails.cust_first_name+' '+taskDetails.cust_last_name;     

        if(isEmpty(errors.to) && isEmpty(errors.message) && !isEmpty(fields.to) && !isEmpty(fields.message)){
            activeFormBtn = true;
        };
        
        for (let i = 0; i < rate; i++) {
            let key = "star-sm-"+i;
            starObj.push(<img key={key} src="/assets/star-sm.svg" />);
        };

		return (
			<Modal size="xl" className="c-modal boxmod repMod " show={replyModalShow} onHide={this.props.handleCloseModal}>
	            <Modal.Header closeButton>
	                <Modal.Title>Reply to Customer</Modal.Title>
	            </Modal.Header>

                <Form autoComplete="off" onSubmit= {this.handleReply}>
    				<Modal.Body>
                        <Row noGutters >
                            <Col md="6" sm="12" className="l_col">
                                <div className="merchant_box">
                                    <h4>Merchant</h4>
                                    <div className="form-group">
                                        <label htmlFor="name">Order Number</label>
                                        <input type="text" placeholder="Order Number" disabled={true} style={{background: 'none'}} className="t_box" name="order_number" defaultValue={taskDetails.tp_order_number} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="order-number">Customer Name</label>
                                        <input type="text" placeholder="Customer Name" disabled={true} style={{background: 'none'}} className="t_box" name="customer_name" defaultValue={customerName}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="store">Date · Time</label>
                                        {getDeliveryWindow(taskDetails.order_details.completeAfter, taskDetails.order_details.completeBefore, taskDetails.order_details.time_zone)}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="order-number">Customer Rating</label>
                                        <span className="starwrap">{starObj}</span>
                                    </div>
                                </div>
                                <div className="merchant_box">
                                    <h4>Comments</h4>
                                    <p>{taskDetails.comment}</p>
                                </div>
                            </Col>
                            <Col md="6" sm="12" className="r_col task-d">
                                <div className="merchant_box">  
                                    <h4>Email to Customer</h4>
                                    <div className="form-group">
                                        <label htmlFor="order-number">To</label>
                                        <input type="text" placeholder="Email" className="t_box" name="to" onChange={this.handleChange} value={fields.to} className={!!errors.to  ? "t_box error" : "t_box" } />
                                    </div>
                                    <textarea name="message" placeholder="Message..." rows="4" onChange={this.handleChange.bind(this)} className={!!errors.message  ? "feedMsg error" : "feedMsg" } defaultValue={fields.message}></textarea>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary" className={(activeFormBtn)? "active" : "" }> {(this.props.isReplying)? 'Processing..' : 'Submit'}</Button>
    				</Modal.Footer>	
                </Form>
	        </Modal>
		)
	};
};

export default ReplyModal;