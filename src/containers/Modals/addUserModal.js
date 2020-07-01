import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {getCookie} from '../../util/cookies';
import { isEmpty, isEqual, map as _map } from 'lodash';
import { Row, Col, Form, Button, FormFeedback } from 'reactstrap';

class AddUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            values: {},
            errors: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    };

    handleValidation(){
        let isError = false;
        let values = this.state.values;
        let errors = this.state.errors;

        //First Name
        if (!!!values.first_name) {
            isError = true;
            errors.first_name = 'First name is required.';
        }; 

        //First Name
        if (!!!values.last_name) {
            isError = true;
            errors.last_name = 'Last name is required.';
        }; 

        //Email
        if(!!!values.email){
            isError = true;
            errors.email = 'Email is required.';
        } else if(values.email) {
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(!reg.test(values.email)) {
                isError = true;
                errors.email = 'Please enter a valid email address.';
            }
        }; 

        //User Type
        if(!!!values.user_type){
            isError = true;
            errors.user_type = 'User type is required.';
        };

       this.setState({ errors: errors });
       return isError;
    };

    handleChange(e){    
        const { name, value } = e.target
        let values = this.state.values;
        values[name] = value; 

        let errors = {...this.state.errors};
        errors[name] = "";
               
        this.setState({values, errors: errors});
    };

    handleChecked(e) {
        const { name, checked } = e.target;
        let values = this.state.values;
        values[name] = checked; 

        this.setState({values});
    };

    handleSubmit(e){
        e.preventDefault();
        let id = this.state.values.id || null;
        let isError = this.handleValidation();

        if(isError) {
            return false;
            console.log("Form has errors.", this.state.errors);
        } else {
            let postData = {...this.state.values};           
            postData['active'] = postData.active.toString();
            postData['show_report'] = postData.show_report.toString();

            if (!id) {
                let userData = getCookie('foodjets_merchant') || {}; 

                postData['org_id'] = userData.org_id;
                postData['org_name'] = userData.org_name;
                postData['org_user_email'] = userData.org_email;
                this.props.addUserData(postData);
            } else {
                this.props.updateUserData(postData);
            }
        }
    };

    componentWillReceiveProps(props) {        
        this.setState({ values: props.initialData, errors: props.initialUserErrorData });
    };

    render() {
        let activeFormBtn = false;
        const { errors, values } = this.state;

        if(isEmpty(errors.first_name) && isEmpty(errors.last_name) && isEmpty(errors.email) && isEmpty(errors.user_type) && !isEmpty(values.first_name) && !isEmpty(values.last_name) && !isEmpty(values.email) && !isEmpty(values.user_type)){
            activeFormBtn = true;
        };

        return (
            <Modal size="md" className="c-modal" data="ignore-outer-click" show={this.props.show} onHide={() => { this.props.handleShowUserModel('CLOSE') }}>
                <Modal.Header closeButton>
                    <Modal.Title>{(this.props.action === 'EDIT')?'Edit User':'Add User'}</Modal.Title>
                </Modal.Header>

                <Form autoComplete="off" onSubmit= {this.handleSubmit}>
                    <Modal.Body>
                        <Row noGutters>
                            <Col md="12" sm="12" className="c_info">
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <input type="text" placeholder="Enter First Name" className={!!errors.first_name  ? "t_box error" : "t_box" } name="first_name" onChange={this.handleChange} value={values.first_name} />

                                    {errors.first_name && ( <FormFeedback style={{display: 'block'}}> {errors.first_name}</FormFeedback>  )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input type="text" placeholder="Enter Last Name" className={!!errors.last_name  ? "t_box error" : "t_box" } name="last_name" onChange={this.handleChange} value={values.last_name} />

                                    {errors.last_name && ( <FormFeedback style={{display: 'block'}}> {errors.last_name}</FormFeedback>  )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" placeholder="Enter Email" className={!!errors.email  ? "t_box error" : "t_box" } name="email" onChange={this.handleChange} value={values.email} />

                                    {errors.email && ( <FormFeedback style={{display: 'block'}}> {errors.email}</FormFeedback>  )}
                                </div>

                                <div className="form-group dselect">
                                    <label htmlFor="user_type">User Type</label>
                                    <select className={!!errors.user_type  ? "s_box error" : "s_box" } name="user_type" onChange={this.handleChange} value={values.user_type}>
                                        <option value="">-- Select User Type --</option>
                                        <option key={1} value="general">General</option>
                                        <option key={2} value="pharmacy">Pharmacy</option>
                                        <option key={3} value="admin">Admin</option>
                                    </select>

                                    {errors.user_type && ( <FormFeedback style={{display: 'block'}}> {errors.user_type}</FormFeedback>  )}
                                </div>

                                {
                                    (values.user_type && values.user_type === 'admin')?
                                    <div className="form-group">
                                        <span className="c_boxgroup sreport">
                                            <label htmlFor="show_report">Show Report</label>
                                            <input type="checkbox" id="show_report" name="show_report" className="c_box" onChange={this.handleChecked} checked={values.show_report} />
                                        </span>
                                    </div>:null
                                }
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button type="submit" className={(activeFormBtn)? "active" : "" } variant="primary" disabled={!!this.props.isUserUpdating}>{(this.props.isUserUpdating)? 'Processing..' : 'Confirm'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    };
};

export default AddUserModal;