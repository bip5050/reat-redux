import React, { Component } from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import {getDetails} from './orderDetailsTemplate';
  
class TaskDetails extends Component{
    constructor(props) {
        super(props);
        this.state              =   {
           show         :   false
        }
        this.handleClose        =   this.handleClose.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            show: props.show
        })
    }

    handleClose() {
        this.setState({show: false});
    }
    
    render() {
        let show            =   this.state.show || false;
        let taskDetails     =   this.props.taskDetails || {};
        //console.log(taskDetails, events);
        return (
            <Modal size="md" className="c-modal" show={show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                {getDetails(taskDetails)}
            </Modal>
        )

    }
}
export default TaskDetails;