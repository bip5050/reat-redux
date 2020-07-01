import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { Modal } from 'react-bootstrap';

class toastModal extends Component {
 	constructor(props) {
        super(props);
        this.state = {        	
			toastModalShow: true,
        }
    };
    handleCloseModal(){
		this.setState({ toastModalShow: false });
	};
	componentWillReceiveProps(props) {
        this.setState({ toastModalShow: props.toastModalShow });
    }; 

	render() {
		const { toastModalShow } = this.state;
        let taskDetails = this.props.taskDetails || {};

        console.log('taskDetails', taskDetails);

		return (
			<Modal size="sm" className="tost-modal" show={toastModalShow} onHide={this.props.handleCloseModal}>
	            <Modal.Body>
                    <Row noGutters>
                        <Col md="12" sm="12" className="">
                            <h4>Welcome to a Fresh, Simpler Dashboard</h4>
                            <p>We’re still working on making the experience the best it can be for you so we would love to hear your feedback.</p>
                            <ul>
                                <li><img src="/assets/sun_ico.svg" alt="ico" /> New light theme for easier navigation</li>
                                <li><img src="/assets/customers_ico.svg" alt="ico" /> Revamped Feedback page with option to respond to customers</li>
                                <li><img src="/assets/tostsearch_ico.svg" alt="ico" /> Improved search functionality to find what you need faster</li>
                            </ul>
                        </Col>    
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" className="sbtn" variant="primary" onClick={(e)  => this.handleCloseModal()}>
                        Start
                    </Button>
				</Modal.Footer>	
	        </Modal>
		)
	};
};

export default toastModal;