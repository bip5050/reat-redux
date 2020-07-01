import React, { Component } from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import {findIndex as _findIndex, isEmpty, isEqual} from 'lodash';
import moment from 'moment-timezone';

class TrackDetails extends Component{
    constructor(props) {
        super(props);
        this.state              =   {
           show         :   false
        }
        this.handleClose        =   this.handleClose.bind(this);
    }

    componentWillReceiveProps(props) {
        //console.log('Props : ', props);
        this.setState({
            show: props.show
        })
    }

    handleClose() {
        this.setState({show: false});
    }
    
    render() {
        let show            =   this.state.show || false;
        return (
            <Modal size="md" className="c-modal" show={show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.trackDriver}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row noGutters>
                        <Col md="12" sm="12" className="c_info">
                            {
                                (!!this.props.currentUrl) ?
                                <iframe  frameborder="0" width="100%" src={this.props.currentUrl} style={{border:'none!important', height:'500px'}}></iframe>
                                : null
                            }
                        </Col>    
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
}
export default TrackDetails;