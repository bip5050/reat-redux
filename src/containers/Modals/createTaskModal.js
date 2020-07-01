import React, { Component } from 'react';
import {
    Row,
    Col,
    Button,
    Form
} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { addressFormater } from '../../util/helper';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {findIndex as _findIndex, isEmpty, isEqual} from 'lodash';
import moment from 'moment-timezone';
import StoreDropdown from '../Filter/storeDropdown';
import LocationDropdown from '../Filter/locationDropdown';

class CreateTask extends Component{
    constructor(props) {
        super(props);
        this.defaultErrors      =   {
            merchant_name: "",
            last_name:  "",
            merchant_phone:"",
            orderNumber:"",
            store:"",
            merchant_address:"",
            recipient_name:"",
            delivery_date:"",
            recipient_phone:"",
            delivery_time:""
        }
        this.state              =   {
           show         :   false,
           alcohol      :   false,
           signature    :   true,
           locations    :   [],
           formData     :   {},
           settingsData :   {},
           startDate    :   new Date(),
           recipient_address    :   '',
           recipient_location   :   {
                zipcode: '',
                state_code: '',
                latitude: '',
                longitude: '',
                address: ''
            },
            /* errors:{
                merchant_name: "",
                last_name:  "",
                merchant_phone:"",
                orderNumber:"",
                store:"",
                merchant_address:"",
                recipient_name:"",
                delivery_date:"",
                recipient_phone:"",
                delivery_time:""
            } */
        }
        this.handleClose        =   this.handleClose.bind(this);
        this.handleCbox         =   this.handleCbox.bind(this);
        this.handleCreateTask   =   this.handleCreateTask.bind(this);
        this.validateForm       =   this.validateForm.bind(this);
        this.onChangeHandle     =   this.onChangeHandle.bind(this);
        this.handleChange       =   this.handleChange.bind(this);
        this.onDateSelect       =   this.onDateSelect.bind(this);
    }    
 
    handleChange = recipient_address => {
        //console.log('Recipient Address', recipient_address);
        this.setState({
            recipient_address: recipient_address,
            formData: {
                ...this.state.formData,
                recipient_location: {}
            },
            /* errors: {
                ...this.state.errors,
                recipient_address:""
            } */
        });
    };   
        
    selectStore = (store, k) => {
        /* let errors                      =   {...this.state.errors};
        errors['merchant_address']      =   "";
        errors['merchant_phone']        =   ""; */
        let index                       =   (this.props.locations || []).findIndex((item) => item.id === store.id);
        if(!!store.id) {
            //let store       =   this.props.stores[this.state.formData.store];
            this.setState({
                formData: {
                    ...this.state.formData,
                    store               :   store.id,
                    merchant_address    :   store.id,
                    merchant_phone      :   store.data.phone,
                    merchant_notes      :   store.data.note
                },
                //errors: errors
            })
        } else {
            this.setState({
                formData: {
                    ...this.state.formData,
                    store               :   '',
                    merchant_address    :   '',
                    merchant_phone      :   '',
                    merchant_notes      :   ''
                },
                //errors: errors
            })
        }
       
    };

    selectMerchantAddress = (location, k) =>{
        /* let errors                  =   {...this.state.errors};
        errors['store']             =   "";
        errors['merchant_phone']    =   ""; */
        let index                       =   (this.props.locations || []).findIndex((item) => item.id === location.id);
        if(!!location.id) {
            //let location            =   this.props.locations[this.state.formData.merchant_address];
            this.setState({
                formData: {
                    ...this.state.formData,
                    store               :   location.id,
                    merchant_address    :   location.id,
                    merchant_phone      :   location.data.phone,
                    merchant_notes      :   location.data.note
                },
                //errors: errors
            })
        } else {
            this.setState({
                formData: {
                    ...this.state.formData,
                    store               :   '',
                    merchant_address    :   '',
                    merchant_phone      :   '',
                    merchant_notes      :   ''
                },
                //errors: errors
            })
        }
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
                //delvAddIndex = _findIndex(delAddData, {address: data.address});
                /* if(delvAddIndex != -1){
                self.editDelvAdd(delvAddIndex);
                } else { */
                    let addressArray = addressFormater(data.address);
                    //console.log('Address : ', data.address, addressArray);
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
                            /* errors: {
                                ...self.state.errors,
                                recipient_address:""
                            }, */
                            formData: {
                                ...self.state.formData,
                                recipient_location: data
                            },
                            recipient_address: data.address }); 
                    } else {
                        //notiyerror('Oops, that does not seem like a valid address. Please try again.');
                        self.setState({
                            formData: {
                                ...self.state.formData,
                                recipient_location: {}
                            }/* ,
                            errors: {
                                ...self.state.errors,
                                recipient_address:"Invalid Address"
                            } */
                        });
                    }//
                //}             
            } else {
                //notiyerror('Oops, that does not seem like a valid address. Please try again.');
                self.setState({
                    formData: {
                        ...self.state.formData,
                        recipient_location: {}
                    }/* ,
                    errors: {
                        ...self.state.errors,
                        recipient_address:"Invalid Address"
                    } */
                });
            }
        })
        .catch((error) => {
            self.setState({
                formData: {
                    ...self.state.formData,
                    recipient_location: {}
                }/* ,
                errors: {
                    ...self.state.errors,
                    recipient_address:"Invalid Address"
                } */
            });
            console.error('Error', error)
        });
    };

    onDateSelect = date => {
        this.setState({
            formData: {
                ...this.state.formData,
                delivery_date: date
            }/* ,
            errors: {
                ...this.state.errors,
                delivery_date: ''
            } */
        });
    };

    handleCbox(e) {
        let target  =    e.target;
        this.setState({
            [e.target.name]: !this.state[e.target.name],
        });
    }

    componentDidMount() {
        let fullname        =   this.props.userData.org_name;
        this.setState({formData: {merchant_name: fullname}});
        this.props.getLocations();
    }

    componentWillReceiveProps(props) {
        //console.log('Create Task Props : ', props.isTaskProcessing, this.props.isTaskProcessing, !!!props.isTaskProcessing && props.isTaskProcessing !== this.props.isTaskProcessing);
        if(!!!props.isTaskProcessing && props.isTaskProcessing !== this.props.isTaskProcessing) {
            this.handleClose();
        } else {
            let fullname        =   this.props.userData.org_name;
            this.setState({
                show: props.show,
                formData     :   {
                    ...this.state.formData,
                    merchant_name   :   fullname
                }
            }, () => {
                this.validateForm()
            })
        }
        if(!isEmpty(props.settingsData) && !isEqual(this.state.settingsData, props.settingsData)) {
           this.timings    =   this.timing(props.settingsData.start_time, props.settingsData.end_time);           
            let delivery_time   =   (!!this.timings.key && !!!this.state.formData.delivery_time) ? this.timings.key : '';
            this.setState({
                settingsData:   props.settingsData,
                formData: { ...this.state.formData, delivery_time: delivery_time}
            })
        }
    }

    handleClose() {
        let fullname        =   this.props.userData.org_name;
        let delivery_time   =   this.timings.key;
        this.setState({
            //show: false,
            recipient_location : {},
            formData     :   {
                merchant_name   :   fullname,
                delivery_time   :   delivery_time
            },
            recipient_address   :   '',
            startDate    :   new Date(),
            recipient_location   :   {
                zipcode: '',
                state_code: '',
                latitude: '',
                longitude: '',
                address: ''
            }/* ,
            errors:{
                merchant_name: "",
                last_name:  "",
                merchant_phone:"",
                orderNumber:"",
                store:"",
                merchant_address:"",
                recipient_name:"",
                delivery_date:"",
                recipient_phone:"",
                delivery_time:""
            } */
        }, function(){
            this.props.handleClose();
        });
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
        //console.log('Date Time : ', datetime);
        return moment.tz(datetime, 'MM/DD/YYYY hh:mm A', tz).utc().unix();
    }

    handleCreateTask(e) { 
        //console.log('Task Type : ', this.props.type);
        e.preventDefault();
        let validate        =   this.validateForm();
        let isError         =   validate.isError;
        //console.log('Is Error : ', isError)
        if(isError) {
            return false;

        } else{

        let formData        =   {...this.state.formData};
        let storeId         =   formData.store;
        let storeIndex      =   (this.props.stores || []).findIndex(item => item.id === storeId);
        let store           =   this.props.stores[storeIndex];
        let timeZone        =   store.data.timeZone;
        let time            =   formData.delivery_time.split('-');
        let from_time       =   time[0];
        let to_time         =   time[1];
        let completeAfter   =   this.utc(formData.delivery_date,  from_time, timeZone);
	    let completeBefore  =   this.utc(formData.delivery_date, to_time, timeZone);
        //console.log('Stores : ', store, completeAfter, completeBefore);
        let data    =   {
            storeId     :   store.data.store_id,
            merchant: {
                name: formData.merchant_name,
                phone: formData.merchant_phone,
                location: [
                    store.data.longitude,
                    store.data.latitude
                ],
                address: {
                    state: store.data.state,
                    postalCode: store.data.postalCode,
                    country: store.data.country,
                    city: store.data.city,
                    street: store.data.street,
                    number: store.data.number
                },
                notes: formData.merchant_notes
            },
            recipient: {
                email: formData.recipient_email,
                name: formData.recipient_name,
                phone: formData.recipient_phone,
                location: [
                    formData.recipient_location.longitude,
                    formData.recipient_location.latitude
                ],
                address: {
                    state: formData.recipient_location.state_code,
                    postalCode: formData.recipient_location.zipcode,
                    country: formData.recipient_location.country,
                    city: formData.recipient_location.city,
                    street: formData.recipient_location.street,
                    number: formData.recipient_location.number
                },
                notes: formData.recipient_notes
            },
            orderNumber: formData.orderNumber,
            store: store.data.store,
            completeAfter: completeAfter,
            completeBefore: completeBefore,
            timezone: timeZone,
            alcohol: this.state.alcohol,
            //taskType: (!!this.props.pharmacy) ? 'pharmacy' : 'general',//this.props.taskType,
            taskType: this.props.type,
            metadata: null,
            signature: true,
            tip: (!!formData.tip) ? formData.tip : 0,
            sms: {
                merchantStart: store.data.sms.merchant_start,
                merchantEta: store.data.sms.merchant_eta,
                recipientStart: store.data.sms.recipient_start,
                recipientEta: store.data.sms.recipient_eta
            }
        }
        //console.log('Form Submitted : ', data);
        this.props.createTask(data);
        //this.handleClose();
    }
    }
    
    validateForm(){
        let formData                =   this.state.formData || {};
        //let errors                  =   this.state.errors || {};
        let errors                  =   {...this.defaultErrors};
        let isError                 =   false;
        if(!!!formData.merchant_name){
            errors.merchant_name    =   true;
            isError                 =   true;
        }        
        if(!!!formData.merchant_phone){
            errors.merchant_phone   =   true;
            isError                 =   true;
        }
        else {
            if(formData.merchant_phone.length!=10 && !isNaN(formData.merchant_phone)) {
                errors.merchant_phone   =   true;
                isError                 =   true;
            }
        }       
        if(!!!formData.orderNumber){
            errors.orderNumber      =   true;
            isError                 =   true;
        }        
        if(!!!formData.store){
            errors.store            =   true;
            isError                 =   true;
        }     
        if(!!!formData.merchant_address){
            //console.log("here",!!!formData.merchant_address, formData.merchant_address); 
            errors.merchant_address     =   true;
            isError                     =   true;
        }
        if(!!!formData.recipient_name) {
            errors.recipient_name   =   true;
            isError                 =   true;
        }
        if(!!!formData.delivery_date) {
            errors.delivery_date    =   true;
            isError                 =   true;
        }
        if(!!!formData.delivery_time) {
            errors.delivery_time    =   true;
            isError                 =   true;
        }
        if(!!!formData.recipient_phone) {
           
            errors.recipient_phone  =   true;
            isError                 =   true;
        } else {
            if(formData.recipient_phone.length!=10 || isNaN(formData.recipient_phone)) {
                errors.recipient_phone  =   true;
                isError                 =   true;
            }
        }
        if(isEmpty(formData.recipient_location) || !!errors.recipient_address) {
            errors.recipient_address    =   true;
            isError                     =   true;
        }
        if(!!formData.tip && isNaN(formData.tip)) {
            errors.tip              =   true;
            isError                 =   true;
        }
        return {isError: isError, errors: errors};
    }

    onChangeHandle(e) {
        let self                    =   this;
        let formData                =   { ...this.state.formData};
        //console.log('Form Data : ', formData, e.target.name, e.target.value, e.target.checked);
        const name                  =   e.target.name;
        const value		            =   e.target.value
        formData[name]              =   value;
        let errors                  =   {...this.state.errors};
        errors[name]                =   "";
        //console.log("from dta",formData);
        this.setState({ formData: formData, errors: errors }, function(){
            if(name === "store")
                self.selectStore();
                //console.log(name);
            if(name === "merchant_address")
                self.selectMerchantAddress();
        });
    }

    render() {
        let show                =   this.state.show || false;
        let locationData        =   this.props.locations || {};
        let pharmacy            =   this.props.pharmacy || false;
        let stores              =   this.props.stores || [];
        let locations           =   this.props.locations || [];
        let taskType            =   this.props.taskType || '';
        let formData            =   this.state.formData || {};
        //let timings             =   this.timings.data || [];
        let timings             =   (!!this.timings && !!this.timings.data) ? this.timings.data : [];
        let currentTime         =   (!!this.props.timings) ? this.props.timings.key : [];
        let validate            =   this.validateForm();
        //let errors              =  this.state.errors ;
        let errors              =   validate.errors;
        let isDisabled          =   validate.isError;
        /* if(!!errors.merchant_name
            || !!errors.orderNumber
            || !!errors.store
            || !!errors.merchant_address
            || !!errors.merchant_phone
            || !!errors.delivery_date
            || !!errors.delivery_time
            || !!errors.recipient_name
            || !!errors.recipient_address
            || !!errors.recipient_phone
            || !!errors.tip) {
            isDisabled          =   true;
        } */
        //console.log('Pharmacy : ', this.props.pharmacy);
        //console.log('Form data : ', this.state.formData);
        //console.log('Errors ', errors);
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

        const inputProps = {
            type: "text",
            id: "del_add_name_hdr",
            value: this.state.address ? this.state.address: '',
            //onChange: this.addHandleChange,
            placeholder: 'Where are you?',
            autoFocus: true
        };
        //console.log('Errors : ', errors);
        //console.log('Stores : ', this.props.stores);
        //console.log('Locations : ', this.props.locations);
        return (
            <Modal size="lg" className="c-modal boxmod" show={show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Task</Modal.Title>
                </Modal.Header>
                <Form autoComplete="off" onSubmit={this.handleCreateTask}>
                    <Modal.Body>
                        <Row noGutters>
                            <Col md="6" sm="12" className="l_col"> 
                                <div className="merchant_box">
                                <h4>Merchant</h4>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    {/* <input type="text" placeholder="Enter Name" className={!!errors.merchant_name  ? "t_box error" : "t_box" } name="merchant_name" onChange={this.onChangeHandle} value={formData.merchant_name}/> */}
                                    {formData.merchant_name}
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="store">Store</label>
                                    {/* <select className={!!errors.store ? "s_box error" : "s_box"} name="store" onChange={this.onChangeHandle} value={formData.store}>
                                        <option value="">-- Select --</option>
                                        {
                                            stores.map((v, k)    =>  {
                                                return (
                                                    <option key={k} value={k}>{v.label}</option>
                                                )
                                            })
                                        }
                                    </select> */}
                                    
                                    <StoreDropdown
                                        stores              =   {this.props.stores}
                                        selected            =   {formData.store}
                                        className           =   {!!errors.store ? "error" : ""}
                                        handleStoreChange   =   {this.selectStore}
                                        /* handleRemoveFilter={this.handleRemoveFilter} */
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    {/* <select className={!!errors.merchant_address ? "s_box error" : "s_box"} name="merchant_address" onChange={this.onChangeHandle} value={formData.merchant_address}>
                                        <option value="">-- Select --</option>
                                        {
                                            locations.map((v, k)    =>  {
                                                return (
                                                <option key={k} value={k}>{v.label}</option>
                                                )
                                            })
                                        }
                                    </select> */}                              
                                    
                                    <LocationDropdown
                                        locations               =   {this.props.locations}
                                        selected                =   {formData.merchant_address}
                                        className               =   {!!errors.merchant_address ? "error" : ""}
                                        handleLocationChange    =   {this.selectMerchantAddress}
                                        /* handleRemoveFilter={this.handleRemoveFilter} */
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="order-number">Order Number</label>
                                    <input type="text" placeholder="Enter order number"  className={!!errors.orderNumber  ? "t_box error" : "t_box" } name="orderNumber" onChange={this.onChangeHandle} value={formData.orderNumber}/>
                                </div>                                
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="text" placeholder="Enter phone number" className={!!errors.merchant_phone ? "t_box error" : "t_box" } name="merchant_phone" onChange={this.onChangeHandle} value={formData.merchant_phone}/>
                                </div>
                                </div>
                                <div className="merchant_box">
                                <h4>Delivery</h4>
                                <div className="form-group">
                                    <label htmlFor="delivery">Delivery Date</label>
                                    {/* <input type="text" placeholder="Today" className="t_box" id="delivery" /> */}
                                    <DatePicker className={!!errors.delivery_date ? "t_box error" : "t_box" }  selected={formData.delivery_date} onChange={this.onDateSelect} minDate={new Date()} placeholderText="Today" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="time">Time</label>
                                    {/* <input type="text" placeholder="02:00pm – 2:30pm" className="t_box" id="time" /> */}
                                    <select className={!!errors.delivery_time ? "t_box error" : "t_box" }  selected={formData.delivery_date} name="delivery_time" onChange={this.onChangeHandle} value={formData.delivery_time}>
                                        <option>-- Select --</option>
                                        {
                                            (timings || []).map((v, k)    =>  {
                                                return (
                                                <option key={k} value={v.t}>{v.t}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="d-notes">Driver Notes</label>
                                    <input type="text" className="t_box" name="merchant_notes" onChange={this.onChangeHandle} value={formData.merchant_notes}/>
                                </div>
                                </div>
                            </Col>
                            <Col md="6" sm="12" className="r_col">
                                <div className="merchant_box">
                                <h4>Recipient</h4>
                                <div className="form-group">
                                    <label htmlFor="rname">Name</label>
                                    <input type="text" autoComplete="off" placeholder="Enter Name" className={!!errors.recipient_name  ? "t_box error" : "t_box" } name="recipient_name" onChange={this.onChangeHandle} value={formData.recipient_name}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="raddress">Address</label>
                                    {/* <input type="text" placeholder="Enter address" className="t_box" id="rddress" /> */}
                                    <PlacesAutocomplete
                                        value={this.state.recipient_address}
                                        onChange={this.handleChange}
                                        onSelect={this.handleSelect}
                                        styles={rsSrchStyles}
                                    >
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                        <div className="pRelative error">
                                            <input
                                            autoComplete="off"
                                            {...getInputProps({
                                                placeholder: 'Enter Address',
                                                className: !!errors.recipient_address  ? "t_box error" : "t_box",
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
                                        )}
                                    </PlacesAutocomplete>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rphone">Phone</label>
                                    <input type="text" placeholder="Enter phone number" className={!!errors.recipient_phone ? "t_box error" : "t_box" } name="recipient_phone" onChange={this.onChangeHandle} value={formData.recipient_phone}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="remail">Email</label>
                                    <input type="email" placeholder="Enter email" className="t_box" name="recipient_email" onChange={this.onChangeHandle} value={formData.recipient_email}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">Add notes</label>
                                    <input type="text" className="t_box" name="recipient_notes" onChange={this.onChangeHandle} value={formData.recipient_notes}/>
                                </div>
                                <div className="form-group">
                                    <span className="c_boxgroup">
                                        <label htmlFor="alcohol">Alcohol</label>
                                        <input type="checkbox" id="alcohol" name="alcohol" className="c_box" checked={this.state.alcohol} onChange={(e)=>this.handleCbox(e)}/>
                                    </span>
                                    {/* <span className="c_boxgroup">
                                        <label htmlFor="signature">Signature</label>
                                        <input type="checkbox" id="signature" name="signature" className="c_box" checked={this.state.signature} onChange={(e)=>this.handleCbox(e)}/>
                                    </span> */}
                                </div>
                                </div>
                                <div className="merchant_box">
                                <h4>Optional</h4>
                                <div className="form-group">
                                    <label htmlFor="tip">Tip</label>
                                    <input type="text" placeholder="0.00" className={!!errors.tip ? "t_box error" : "t_box" } name="tip" onChange={this.onChangeHandle} value={formData.tip}/>
                                </div>
                                {/* <div className="form-group">
                                    <label htmlFor="store-id">Store ID</label>
                                    <input type="email" placeholder="Enter Store ID" className="t_box" id="store-id" />
                                </div> */}
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" disabled={isDisabled || !!this.props.isTaskProcessing} className={(!this.props.isTaskProcessing && !isDisabled) ? 'active' : ''} variant="primary">
                            {(!!this.props.isTaskProcessing)? 'Processing..' : 'Submit'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}
export default CreateTask;