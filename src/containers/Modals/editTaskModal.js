import React, { Component } from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { addressFormater } from '../../util/helper';
import {error as notifyerror, success as notifysuccess} from '../../util/notify';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {isEmpty, isEqual} from 'lodash';
import moment from 'moment-timezone';
import { getDateTime } from '../../Helper/common';

class EditTask extends Component{
    constructor(props) {
        super(props);
        this.state              =   {
           show                     :   false,
           alcohol                  :   false,
           signature                :   true,
           locations                :   [],
           formData                 :   {},
           startDate                :   new Date(),
           settingsData             :   {},
           recipient_location       :   {},
           merchant_location        :   {},
           isProcessing             :   false,
           errors:{
               merchant_address:"",
               recipient_address:"",
               delivery_date:"",
               delivery_time:"",
               tip:""
           }
        }
        this.handleClose            =   this.handleClose.bind(this);
        this.handleEditTask         =   this.handleEditTask.bind(this);
        this.validateForm           =   this.validateForm.bind(this);
        this.onChangeHandle         =   this.onChangeHandle.bind(this);
        this.handleChange           =   this.handleChange.bind(this);
        this.handleMerchantChange   =   this.handleMerchantChange.bind(this);
        this.onDateSelect           =   this.onDateSelect.bind(this);
    }    

    onSelectDate = (date) => {
        this.setState({
            formData: {...this.state.formData,
                delivery_date   :  date
            }
        })
    }
 
    handleMerchantChange = merchant_address => {
        //console.log('Recipient Address', recipient_address);
        this.setState({
            errors: {
                ...this.state.errors,
                merchant_address:(!!merchant_address) ? "" : 'Please enter merchant address'
            },
            merchant_address:merchant_address
        });
    };   
 
    handleChange = recipient_address => {
        //console.log('Recipient Address', recipient_address);
        this.setState({
            errors: {
                ...this.state.errors,
                recipient_address:(!!recipient_address) ? "" : 'Please enter recipient address'
            },
            recipient_address : recipient_address
        });
    };

    handleSelect = recipient_address => {
        let self    =   this;
        let data = {
            zipcode: '',
            state_code: '',
            latitude: '',
            longitude: '',
            address: ''
        };
        geocodeByAddress(recipient_address)
        .then((results) => {
            //console.log(recipient_address, results[0], results[0].formatted_address);
            data.address = results[0].formatted_address || '';
            return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
            //console.log(lat, lng, data.address);
            let matchExp = /(\d+) (.+?), (.+?), (.+?) ([0-9]{5})/g;
            if(matchExp.test(data.address)){
                let delAddData = this.props.deliveryAddress;
                let addressArray = addressFormater(data.address);
                console.log('Address : ', data.address, addressArray);
                if(!isEmpty(addressArray) && addressArray.validAdrs){
                    data.latitude = lat;
                    data.longitude = lng;
                    data.address = addressArray.address;
                    data.zipcode = addressArray.zipcode;
                    data.state_code = addressArray.state_code;
                    data.city = addressArray.city;
                    data.country = addressArray.country;
                    data.number = addressArray.number;
                    data.street = addressArray.street;

                    //console.log('AddressBox ###########', data);
                    //this.setState({ address: addressArray.address }); 
                    self.setState({
                        errors: {
                            ...self.state.error,
                            recipient_address:""
                        },
                        recipient_location: data,
                        recipient_address: data.address
                    }); 
                } else {
                    notifyerror('Oops, that does not seem like a valid address. Please try again.');
                    self.setState({
                        errors: {
                            ...self.state.error,
                            recipient_address:"Invalid Address"
                        },
                        recipient_location: {}
                        //recipient_address: ''
                    }); 
                }             
            } else {
                notifyerror('Oops, that does not seem like a valid address. Please try again.');
                self.setState({
                    errors: {
                        ...self.state.error,
                        recipient_address:"Invalid Address"
                    },
                    recipient_location: {}
                    //recipient_address: ''
                }); 
            }
        })
        .catch(error => {
            self.setState({
                errors: {
                    ...self.state.error,
                    recipient_address:"Invalid Address"
                },
                recipient_location: {}
            });
            console.log('Error', error);
        });
    };    

    handleMerchantSelect = merchant_address => {
        let self    =   this;
        let data = {
            zipcode: '',
            state_code: '',
            latitude: '',
            longitude: '',
            address: ''
        };
        geocodeByAddress(merchant_address)
        .then((results) => {
            data.address = results[0].formatted_address || '';
            return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
            //console.log(lat, lng, data.address);
            let matchExp = /(\d+) (.+?), (.+?), (.+?) ([0-9]{5})/g;
            if(matchExp.test(data.address)){
                let delAddData = this.props.deliveryAddress;
                let addressArray = addressFormater(data.address);
                if(!isEmpty(addressArray) && addressArray.validAdrs){
                    data.latitude = lat;
                    data.longitude = lng;
                    data.address = addressArray.address;
                    data.zipcode = addressArray.zipcode;
                    data.state_code = addressArray.state_code;
                    data.city = addressArray.city;
                    data.country = addressArray.country;
                    data.number = addressArray.number;
                    data.street = addressArray.street;
                    self.setState({
                        errors: {
                            ...self.state.error,
                            merchant_address:""
                        },
                        merchant_location: data,
                        merchant_address: data.address
                    }); 
                } else {
                    self.setState({
                        errors: {
                            ...self.state.error,
                            merchant_address:"Invalid Address"
                        },
                        merchant_location: {}
                        //merchant_address: ''
                    }); 
                }          
            } else {
                self.setState({
                    errors: {
                        ...self.state.error,
                        merchant_address:"Invalid Address"
                    },
                    merchant_location: {}
                    //merchant_address: ''
                }); 
            }
        })
        .catch(error => {
            self.setState({
                errors: {
                    ...self.state.error,
                    merchant_address:"Invalid Address"
                },
                merchant_location: {}
            });
            console.log('Error', error);
        });
    };

    onDateSelect = date => {
        this.setState({
            formData: { ...this.state.formData, delivery_date: date}
        });
    };

    handleEditClick = (e)  => {
        //e.preventDefault();
        e.stopImmediatePropagation()
        console.log('Handle Edit Click');
    }

    componentDidMount() {
        document.addEventListener("click", this.handleEditClick);        
    }

    componentWillReceiveProps(props) {
        //console.log(props.show, this.props.show, props.isProcessing, this.props.isProcessing);
        /* if(props.show !== this.props.show) {
            this.setState({
                show: props.show
            })
        } */
        if(props.isProcessing !== this.props.isProcessing) {
            this.setState({
                isProcessing: false
            })
        }
        if(!isEmpty(props.settingsData) && !isEqual(this.state.settingsData, props.settingsData)) {
            this.timings        =   this.timing(props.settingsData.start_time, props.settingsData.end_time);           
            let delivery_time   =   (!!this.timings.key && !!!this.state.formData.delivery_time) ? this.timings.key : '';
            this.setState({
                settingsData:   props.settingsData,
                formData: { 
                    ...this.state.formData, delivery_time: delivery_time
                }
            })
        }
        if(!isEqual(props.taskDetails, this.props.taskDetails) && !isEmpty(props.taskDetails)) {
            let taskDetails =   props.taskDetails || {};
            let tskStatus = 'Scheduled';
            if(taskDetails.tskStatus === 'tsk_proc_hld') {
                tskStatus = 'Scheduled'
            } else if(taskDetails.tskStatus === 'tsk_proc_mrchnt') {
                tskStatus = 'Scheduled'
            } else if(taskDetails.tskStatus === 'tsk_proc_drv' && taskDetails.driverStatus === 'drv_strt_recpnt_tsk') {
                tskStatus = 'Picked Up';
            } else if(taskDetails.tskStatus === 'tsk_proc_drv') {
                tskStatus = 'Processing'
            } else if(taskDetails.tskStatus === 'tsk_cmp') {
                tskStatus = 'Completed'
            } else if(taskDetails.tskStatus === 'tsk_cncling') {
                tskStatus = 'Deleted'
            } else if(taskDetails.tskStatus === 'tsk_cncled') {
                tskStatus = 'Deleted'
            }

            if(tskStatus !== 'Scheduled') {
                notifysuccess({message: `Task is already in ${tskStatus} mode.`});
                this.handleClose();
            }
            
            let toTime              =   getDateTime(parseInt(props.taskDetails.completeBefore) * 1000, props.taskDetails.time_zone, 'hh:mm A');
            let fromTime            =   getDateTime(parseInt(props.taskDetails.completeAfter) * 1000, props.taskDetails.time_zone, 'hh:mm A');
            //let delivery_date       =   moment.tz(parseInt(props.taskDetails.completeAfter) * 1000, props.taskDetails.time_zone).unix();
            let fulldate            =   moment.tz(parseInt(props.taskDetails.completeAfter) * 1000, props.taskDetails.time_zone);
            let year                =   fulldate.format('YYYY');
            let month               =   fulldate.format('MM');
            month                   =   month - 1; 
            let date                =   fulldate.format('DD');
            let delivery_date       =   new Date(year, month, date);
            //console.log(fulldate.format('YYYY-MM-DD'), year, month, date, dateObj, fulldate.format('x'));
            //console.log(dateObj, parseInt(props.taskDetails.completeAfter), props.taskDetails.time_zone, moment.tz(parseInt(props.taskDetails.completeAfter) * 1000, props.taskDetails.time_zone).format('lll'), moment.tz(parseInt(props.taskDetails.completeAfter) * 1000, props.taskDetails.time_zone).format('YYYY-MM-DD'));
            this.setState({
                merchant: props.taskDetails.merchant,
                recipients: props.taskDetails.recipients,
                recipient_address   :   (!!props.recpnt_address) ? props.recpnt_address : '',
                merchant_address    :   (!!props.mrchnt_address) ? props.mrchnt_address : '',
                time_zone           :   props.taskDetails.time_zone,
                formData : {
                    merchant_notes      :   (!!props.taskDetails.merchant && !!props.taskDetails.merchant.notes) ? props.taskDetails.merchant.notes : '',
                    recipient_notes     :   (!!props.taskDetails.recipients && !!props.taskDetails.recipients.notes) ? props.taskDetails.recipients.notes : '',
                    tip                 :   props.taskDetails.tip,
                    delivery_date       :   delivery_date,
                    delivery_time       :   fromTime + '-' + toTime
                }
            })
        }
    }

    /* shouldComponentUpdate(nextProps) {
        console.log('Should Update : ', nextProps);
        return true;
    } */

    handleClose() {
        this.setState({show: false});
        this.props.handleClose();
    }

    timing(start, end) {
       //console.log('Start End : ', start, end);
       let today = moment().format('MM/DD/YYYY');
       let now = moment().unix();
       let gap = 30 * 60;
       let key = "";
       let stimestamp = moment(today+' '+start, 'MM/DD/YYYY H:mm').unix();
       let etimestamp = moment(today+' '+end, 'MM/DD/YYYY H:mm').unix();
       let data = [];
       for(let i=stimestamp; i<etimestamp; i=i+gap) {
          data.push({
             t: moment(i*1000).format('hh:mm A')+'-'+moment((i+gap)*1000).format('hh:mm A')
          });
          if(now >= i && now <= i+gap ) {
             key = moment(i*1000).format('hh:mm A')+'-'+moment((i+gap)*1000).format('hh:mm A');
          }
       }
       return {data:data, key: key};
    }

    utc(date, time, tz) {
        let datetime = moment(date).format('MM/DD/YYYY')+' '+time;
        return moment.tz(datetime, 'MM/DD/YYYY hh:mm A', tz).utc().unix();
    }

    handleEditTask(e) {
        e.preventDefault();
        let isError             =   this.validateForm();
        //console.log(this.props.taskDetails);
        if(!!!isError) {
            let formData            =   {...this.state.formData};
            let timeZone            =   this.state.time_zone;
            let time                =   formData.delivery_time.split('-');
            let from_time           =   time[0];
            let to_time             =   time[1];
            let completeAfter       =   this.utc(formData.delivery_date,  from_time, timeZone);
            let completeBefore      =   this.utc(formData.delivery_date, to_time, timeZone);
            let recipient           =   this.state.recipient_location || {};
            let merchant            =   this.state.merchant_location || {};
            let data                =   {};
            data.merchant_notes     =   formData.merchant_notes || '';
            data.recipient_notes    =   formData.recipient_notes || '';
            data.complete_after     =   completeAfter || '';
            data.complete_before    =   completeBefore || '';
            data.tip                =   formData.tip || 0;
            if(!isEmpty(recipient)){
                data.recipient      =   {
                    location        :   [recipient.longitude, recipient.latitude],
                    address         :   {
                        state       :   recipient.state_code,
                        postalCode  :   recipient.zipcode,
                        country     :   recipient.country,
                        city        :   recipient.city,
                        street      :   recipient.street,
                        number      :   recipient.number
                    }
                }
            }
            
            if(!isEmpty(merchant)){
                data.merchant      =   {
                    location        :   [merchant.longitude, merchant.latitude],
                    address         :   {
                        state       :   merchant.state_code,
                        postalCode  :   merchant.zipcode,
                        country     :   merchant.country,
                        city        :   merchant.city,
                        street      :   merchant.street,
                        number      :   merchant.number
                    },
                    store_id        :   this.props.taskDetails.store_id
                }
            }
            this.setState({isProcessing: true});
            this.props.editTask({uuid: this.props.taskDetails.uuid, params: data});
            setTimeout(() => {
                this.handleClose()
            }, 1000);
        }
    }
    
    validateForm(){      
        let formData                    =   this.state.formData || {};
        let errors                      =   this.state.errors || {};
        let isError                     =   false;
        //console.log('Errors : ', this.state.recipient_address, errors.recipient_address, (!!!this.state.recipient_address || !!errors.recipient_address));
        if(!!errors.merchant_address || !!errors.recipient_address) {
            isError                     =   true;
        }

        if(!!!formData.delivery_date) {
            errors.delivery_date        =   "Please enter the delivery date";
            isError                     =   true;
        }

        if(!!!formData.delivery_time) {
            errors.delivery_time        =   "Please enter the delivery time";
            isError                     =   true;
        }

        if(!!!this.state.merchant_address || !!errors.merchant_address) {
            errors.merchant_address     =   "Please enter merchant address";
            isError                     =   true;
        }

        if(!!!this.state.recipient_address || !!errors.recipient_address) {
            errors.recipient_address    =   "Please enter recipient address";
            isError                     =   true;
        }

        /* if(formData.tip === '' || formData.tip === null || formData.tip === undefined) {
            errors.tip                  =   "Please enter the tip";
            isError                     =   true;
        } */

        if(!!formData.tip && isNaN(formData.tip)) {
            errors.tip                  =   "Tip amount should be number";
            isError                     =   true;
        }

        this.setState({errors:errors, isError: isError});
        return isError;
    }

    onChangeHandle(e) {
        let self                    =   this;
        let formData                =   { ...this.state.formData};
        const name                  =   e.target.name;
        const value		            =   e.target.value
        formData[name]              =   value;
        let errors                  =   {...this.state.errors};
        errors[name]                =   "";
        this.setState({ formData: formData, errors: errors });
    }

    render() {
        //console.log('Task Details : ', this.props.taskDetails);
        let taskDetails             =   this.props.taskDetails || {};
        let show                    =   this.props.show || false;
        let errors                  =   this.state.errors || {};
        const err_merchant_address  =   ( errors.merchant_address === "" ) ? null : errors.merchant_address;
        const err_recipient_address =   ( errors.recipient_address === "" ) ? null : errors.recipient_address;
        const err_delivery_date     =   ( errors.delivery_date === "" ) ? null : errors.delivery_date;
        const err_delivery_time     =   ( errors.delivery_time === "" ) ? null : errors.delivery_time;
        const err_tip               =   ( errors.tip === "" ) ? null : errors.tip;
        let formData                =   this.state.formData || {};
        //let timings               =   this.timings.data || [];
        let timings                 =   (!!this.timings && !!this.timings.data) ? this.timings.data : [];
        let isDisabled          =   false;
        if(!!err_merchant_address
            || !!err_recipient_address
            || !!err_delivery_date
            || !!err_delivery_time
            || !!err_tip) {
            isDisabled          =   true;
        }
        //console.log('Error : ', errors);
        const rsSrchStyles = {
            input: {
                width: '260px',
                padding: '0px 15px 0px 35px',
                color: '#333',
                margin:'0'
            },
            autocompleteContainer: {
                borderRadius: '0 0 3px 3px',
                zIndex: '999',
                background: 'url(/static/images/pow_google.jpg) no-repeat right bottom #fff',
                position: 'relative',
                border: '1px solid #e8e8e8',
                boxShadow:'1px 5px 10px rgba(68,68,68,0.2)',
            },
            autocompleteItem: {
                textAlign: 'left',
                fontSize: '12px',
                padding: '5px 8px 5px 30px',
                lineHeight:'20px',
                color: '#999',
                background: '10px 8px #fff',
                margin: '0',
                borderTop:'none',
                borderBottom: '1px solid #ccc',
                background: 'url(/static/images/location_google.png) no-repeat 10px 8px #fff'
            },
            autocompleteItemActive: { color: '#E44500' }
        };

        //const renderFunc    =   ;
        return (
            (!isEmpty(this.props.taskDetails)) ?
            <Modal size="md" className="c-modal" data="ignore-outer-click" show={show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleEditTask}>
                    <Modal.Body>
                        <Row noGutters>
                            <Col md="12" sm="12" className="c_info">
                                <div className="form-group">
                                    <label htmlFor="delivery">Delivery Date</label>
                                    <DatePicker className={`t_box${(!!err_delivery_date) ? ' error' : ''}`}  selected={formData.delivery_date} onChange={this.onDateSelect} minDate={new Date()} placeholderText="Today" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="time">Time</label>
                                    <select className={`s_box${(!!err_delivery_time) ? ' error' : ''}`} name="delivery_time" onChange={this.onChangeHandle} value={formData.delivery_time}>
                                        <option >-- Select --</option>
                                        {
                                            (timings || []).map((v, k)    =>  {
                                                return (
                                                    <option key={k} value={v.t}>{v.t}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    {err_delivery_time && <small className="text-danger">{err_delivery_time}</small>}
                                </div>
                                {
                                    (!!!taskDetails.driver_id) ?
                                    <div className="form-group pr">
                                        <label htmlFor="address">Merchant Address</label>
                                        <PlacesAutocomplete
                                            value={this.state.merchant_address.toString()}
                                            onChange={this.handleMerchantChange}
                                            onSelect={this.handleMerchantSelect}
                                            styles={rsSrchStyles}
                                        >
                                            {
                                                ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                <div>
                                                    <input
                                                    {...getInputProps({
                                                        placeholder: 'Enter Address',
                                                        className: !!err_merchant_address  ? "t_box error" : "t_box",
                                                    })}
                                                    />
                                                    <div className="autocomplete-dropdown-container">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                        ? 'suggestion-item--active'
                                                        : 'suggestion-item';
                                                        // inline style for demonstration purpose
                                                        const style = suggestion.active
                                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                        return (
                                                        <div
                                                            {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                            })}
                                                        >
                                                            <span>{suggestion.description}</span>
                                                        </div>
                                                        );
                                                    })}
                                                    </div>
                                                </div>
                                                )
                                            }
                                        </PlacesAutocomplete>
                                    </div> : null
                                }
                                {
                                    (!!!taskDetails.driver_id) ?
                                    <div className="form-group pr">
                                        <label htmlFor="raddress">Recipient Address</label>
                                        <PlacesAutocomplete
                                            value={this.state.recipient_address.toString()}
                                            onChange={this.handleChange}
                                            onSelect={this.handleSelect}
                                            styles={rsSrchStyles}
                                        >
                                            {
                                                ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                <div>
                                                    <input
                                                    {...getInputProps({
                                                        placeholder: 'Enter Address',
                                                        className: !!err_recipient_address  ? "t_box error" : "t_box",
                                                    })}
                                                    />
                                                    <div className="autocomplete-dropdown-container">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                        ? 'suggestion-item--active'
                                                        : 'suggestion-item';
                                                        // inline style for demonstration purpose
                                                        const style = suggestion.active
                                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                        return (
                                                        <div
                                                            {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                            })}
                                                        >
                                                            <span>{suggestion.description}</span>
                                                        </div>
                                                        );
                                                    })}
                                                    </div>
                                                </div>
                                                )
                                            }
                                        </PlacesAutocomplete>
                                    </div> : null
                                }
                                <div className="form-group">
                                    <label htmlFor="tip">Tip</label>
                                    <input type="text" placeholder="0.00" className={`t_box${(!!err_tip) ? ' error' : ''}`} name="tip" onChange={this.onChangeHandle} value={formData.tip}/>
                                    {err_tip && <small className="text-danger">{err_tip}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="d-notes">Merchant Notes</label>
                                    <input type="text" className="t_box" name="merchant_notes" onChange={this.onChangeHandle} value={formData.merchant_notes}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">Recipient Notes</label>
                                    <input type="text" className="t_box" name="recipient_notes" onChange={this.onChangeHandle} value={formData.recipient_notes}/>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" disabled={isDisabled || !!this.state.isProcessing} className={(!this.state.isProcessing && !isDisabled) ? 'active' : ''} variant="primary">
                            {(!!this.state.isProcessing) ? 'Processing..' : 'Submit'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            : null
        )
    }
}
export default EditTask;