import React, { Component } from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import { addressFormater } from '../../util/helper';
import {error as notifyerror, success as notifysuccess} from '../../util/notify';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {findIndex as _findIndex, isEmpty, isEqual} from 'lodash';
import moment from 'moment-timezone';

class AddLocation extends Component{
    constructor(props) {
        super(props);
        this.errors   =   {
            store            :   false,
            address          :   false,
            phone            :   false,
            store_id         :   false,
            note             :   false,
            invalidAddress   :   false
        }
        this.state              =   {
           /* errors   :   {
               store            :   false,
               address          :   false,
               phone            :   false,
               store_id         :   false,
               note             :   false,
               invalidAddress   :   false
           }, */
           formData :   {
                phone           :   '',
                store           :   '',
                note            :   '',
                store_id        :   '',
                address         :   ''
           },
           location     : {}
        }
        this.handleClose            =   this.handleClose.bind(this);
        this.handleAddressChange    =   this.handleAddressChange.bind(this);
    } 
 
    handleAddressChange = address => {
        //console.log('Recipient Address', recipient_address);
        this.setState({
            /* errors: {
                ...this.state.errors,
                invalidAddress:(!!address) ? false : true
            }, */
            invalidAddress:(!!address) ? false : true,
            formData: {...this.state.formData, address:address},
            location: {}
        });
    };

    handleAddressSelect = address => {
        let timestamp = moment().unix();
        let self    =   this;
        let data = {
            zipcode: '',
            state_code: '',
            latitude: '',
            longitude: '',
            address: ''
        };
        geocodeByAddress(address)
        .then((results) => {
            //console.log(results);
            data.address    =   results[0].formatted_address || '';
            data.place_id   =   results[0].place_id;
            return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
            //console.log(lat, lng, data.address);
            let timezone    =   '';
            fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=AIzaSyCwMjYiTDbntZTUuxDczjOTH3Mk1vD-9_w`)
            .then(response => response.json())
            .then(res => {
                //console.log('Data : ', res);
                timezone    =   res.timeZoneId;
                let matchExp = /(\d+) (.+?), (.+?), (.+?) ([0-9]{5})/g;
                if(matchExp.test(data.address)){
                    let delAddData = this.props.deliveryAddress;
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
                        data.timezone   =   timezone;

                        //console.log('AddressBox ###########', data);
                        //this.setState({ address: addressArray.address }); 
                        self.setState({
                            /* errors: {
                                ...self.state.errors,
                                invalidAddress:false
                            }, */
                            invalidAddress:false,
                            location: data,
                            formData: {...self.state.formData, address:data.address}
                        }); 
                    } else {
                        notifyerror('Oops, that does not seem like a valid address. Please try again.');
                        self.setState({
                            /* errors: {
                                ...self.state.errors,
                                invalidAddress:true
                            }, */
                            location: {},
                            invalidAddress:true,
                            formData: {...this.state.formData, address:''}
                            //recipient_address: ''
                        }); 
                    }             
                } else {
                    notifyerror('Oops, that does not seem like a valid address. Please try again.');
                    self.setState({
                        /* errors: {
                            ...self.state.errors,
                            invalidAddress:true
                        }, */
                        location: {},
                        invalidAddress:true,
                        formData: {...this.state.formData, address:''}
                    }); 
                }
            })
        })
        .catch(error => {
            self.setState({
                /* errors: {
                    ...self.state.errors,
                    invalidAddress:true
                }, */
                location: {},
                invalidAddress:true,
                formData: {...this.state.formData, address:''}
            });
            //console.log('Error', error);
        });
    };

    componentWillReceiveProps(props) {
        this.setState({
            show: props.show
        })
        //console.log('Processing : ', !!!props.isProcessing && props.isProcessing !== this.props.isProcessing);
        if(!!!props.isProcessing && props.isProcessing !== this.props.isProcessing) {
            this.handleClose();
        }
    }

    handleClose() {        
        this.errors   =   {
            store            :   false,
            address          :   false,
            phone            :   false,
            store_id         :   false,
            note             :   false,
            invalidAddress   :   false
        }

        this.setState({
            show: false,
            formData :   {
                phone           :   '',
                store           :   '',
                note            :   '',
                store_id        :   '',
                address         :   ''
           },
           location     : {}
        });
        this.props.handleClose();
    }

    onChangeHandle = (e) => {
        let self                    =   this;
        let formData                =   { ...this.state.formData};
        const name                  =   e.target.name;
        const value		            =   e.target.value
        formData[name]              =   value;
        this.setState({ formData: formData });
    }

    handleCreateLocation    =   (e)  =>  {
        e.preventDefault();
        let location        =   {...this.state.location};
        let formData        =   {...this.state.formData};
        let data        =   {
            address:location.address,
            number:location.number,
            street:location.street,
            city:location.city,
            state:location.state_code,
            country:location.country,
            postalCode:location.zipcode,
            latitude:location.latitude,
            longitude:location.longitude,
            timeZone:location.timezone,
            phone:formData.phone,
            store:formData.store,
            note:formData.note,
            place_id:location.place_id,
            store_id:formData.store_id
        }
        this.props.addLocation(data);
    }

    validateForm() {
        let formData        =   this.state.formData || {};
        let errors          =   {
            store            :   false,
            address          :   false,
            phone            :   false,
            store_id         :   false,
            note             :   false
        };
        //console.log(this.state.location);
        let isError         =   false;
        if(!!!formData.store){
            errors.store        =   true;
            isError             =   true;
        }
        if(!!!formData.store_id){
            errors.store_id        =   true;
            isError             =   true;
        }
        if(!!!formData.address || isEmpty(this.state.location)){
            errors.address        =   true;
            isError             =   true;
        }
        if(!!!formData.phone){
            errors.phone        =   true;
            isError             =   true;
        }
        if(!!formData.phone && (formData.phone.length !== 10 || isNaN(formData.phone))){
            errors.phone        =   true;
            isError             =   true;
        }
        if(!!formData.phone && formData.phone < 1){
            errors.phone        =   true;
            isError             =   true;
        }
        return {isError: isError, errors: errors};
    }

    render() {
        let show                    =   this.props.show || false;
        let formData                =   this.state.formData || {};
        let validate                =   this.validateForm();
        let isDisabled              =   validate.isError;
        let errors                  =   validate.errors || {};
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
            <Modal size="md" className="c-modal" data="ignore-outer-click" show={show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Store</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleCreateLocation}>
                    <Modal.Body>
                        <Row noGutters>
                            <Col md="12" sm="12" className="c_info">
                                <div className="form-group">
                                    <label htmlFor="delivery">Store</label>
                                    <input type="text" placeholder="Enter Store" className={`t_box${(!!errors.store) ? ' error' : ''}`} name="store" onChange={this.onChangeHandle} value={formData.store}/>
                                </div>
                                <div className="form-group pr">
                                    <label htmlFor="address">Address</label>
                                    <PlacesAutocomplete
                                        value={formData.address}
                                        onChange={this.handleAddressChange}
                                        onSelect={this.handleAddressSelect}
                                        styles={rsSrchStyles}
                                    >
                                        {
                                            ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div>
                                                <input
                                                {...getInputProps({
                                                    placeholder: 'Enter Address',
                                                    className:  `t_box${(!!errors.address) ? ' error' : ''}`,
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
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="text" placeholder="Enter Phone No" className={`t_box${(!!errors.phone) ? ' error' : ''}`} name="phone" onChange={this.onChangeHandle} value={formData.phone}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="store-id">Store ID</label>
                                    <input type="text" className={`t_box${(!!errors.store_id) ? ' error' : ''}`} name="store_id" onChange={this.onChangeHandle} value={formData.store_id}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">Driver Notes</label>
                                    <input type="text" className="t_box" name="note" onChange={this.onChangeHandle} value={formData.note}/>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" disabled={isDisabled || !!this.props.isProcessing} className={(!this.props.isProcessing && !isDisabled) ? 'active' : ''} variant="primary">
                            {(!!this.props.isProcessing) ? 'Processing..' : 'Submit'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        )
    }
}
export default AddLocation;