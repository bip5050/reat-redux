import React, {Component} from 'react';
import { getStatusClass } from '../../util/helper';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { isEmpty } from 'lodash';
import { addressFormater } from '../../util/helper';
import { error as notifyerror } from '../../util/notify';
import { Form } from 'reactstrap';
import CustomContext from '../Modals/contextMenu';

export default class CustomFilter extends Component{
    constructor(props) {
        super(props);
        this.state      =   { 
            x               :   '',
            y               :   '',
            typeOpen                :   false,
            search                  :   {
                text                :   '',
                merchant_address    :   '',
                recipient_address   :   '',
                start_time          :   '',
                end_time            :   '',
                type                :   'order-number',
                label               :   'Order Number'
            },
            filteredList            :   {}
        }
        this.timings                    =   [];
        this.changeSearchType           =   this.changeSearchType.bind(this);
        this.handleChange               =   this.handleChange.bind(this);
        this.handleSelect               =   this.handleSelect.bind(this);
        this.handleRecipientChange      =   this.handleRecipientChange.bind(this);
        this.handleRecipientSelect      =   this.handleRecipientSelect.bind(this);
        this.onSearchDelTime            =   this.onSearchDelTime.bind(this);
        this.resetSearch                =   this.resetSearch.bind(this);
        this.handleSearch               =   this.handleSearch.bind(this);
        this.handleSelectbox            =   this.handleSelectbox.bind(this);
        this.collapse                   =   this.collapse.bind(this);
        this.handleContextMenu          =   this.handleContextMenu.bind(this);
    }

    /* shouldComponentUpdate(nextProps, nextState) {
        console.log('Should Update : ', (!!this.state.editShow || !!this.state.detailsShow || this.state.mapShow || !!this.trackShow));
        if(!!this.state.editShow || !!this.state.detailsShow || this.state.mapShow || !!this.trackShow){
            return false;
        } else {
            return true;
        }
    } */

    componentWillReceiveProps(props) {
        this.timings        =   props.timings || {};
        this.setState({
            filteredList:   props.filteredList
        })
    }

    handleContextMenu(event, order) {
        //console.log('Context Menu : ', order);
        let self                   =  this;
        event.preventDefault();        
        const clickX            =   event.pageX;
        const clickY            =   event.pageY;
        let element             =   document.getElementById('sideBar');
        let left                =   0;
        if(element.offsetLeft >= 0)
            left                =   element.clientWidth;
        self.setState({
            visible     :  true,
            x           :  clickX - left,
            y           :  clickY - 250,
            selOrder    :  {...order}
        });
    }

    hideContextMenu = () => {
        this.setState({
            visible     :  false,
            x:0,
            y:0
        });
    }

    collapse(type) {
        this.setState({
            typeOpen: false
        })
    } 

    handleSelectbox(cls) {
        this.setState({
            [cls]: !this.state[cls]
        })
    }

    changeSearchType(data) {
       this.setState({
            search: {
                ...this.state.search,
                type        :   data.type,
                label       :   data.label,
                text        :   '',
                typeOpen    :   false
            },
            //typeOpen    :   !this.state.typeOpen
       })
    }  

    handleSearch(e) {
        let value = e.target.value;
        this.setState({
        search: { ...this.state.search, text: e.target.value }
        }, function () {
        if (value.length > 1)
            this.props.searchFilter({
                type: this.state.search.type,
                value: value,
                user_type: this.props.userType
            });
        else
            this.setState({
                filteredList: {}
            })
        })
    }

    onSearchDelTime(e, type) {
        let self = this;
        /* let i = e.target.value || '';
        let start   =  this.timings.from[i].value;
        let end   =  this.timings.to[i].value; */
        
        let start   =   '';
        let end     =   '';
        if(type === 'start') {
            start   =   e.target.value || '';
            end     =   this.state.search.end_time || '';
        }
        
        if(type === 'end') {
            end   =   e.target.value || '';
            start     =   this.state.search.start_time || '';
        }
        //console.log('Search By time : ', start, end);
        this.setState({
            search: {
                ...this.state.search,
                start_time: start,
                end_time: end
            }
        }, function () {
            if(!!start && !!end) {
                self.props.searchFilter({
                    type: start,
                    value: end,
                    user_type: this.props.userType
                })
            }
        })
    }

    resetSearch() {
        this.setState({
            search                  :   {
                text                :  '',
                merchant_address    :  '',
                recipient_address   :  '',
                delivery_time       :  '',
                start_date          :  '',
                end_date            :  '',
                type                :  'order-number',
                label               :  'Order Number'
            },
            filteredList            : {}
        }, () => {
            this.props.resetSearch();
        })
    }

    handleChange = merchant_address => {
        //console.log('Recipient Address', recipient_address);
        this.setState({ search: { ...this.state.search, merchant_address: merchant_address } });
    };

    handleSelect = merchant_address => {
        //console.log('Merchant Address', merchant_address);
        let self = this;
        let data = {
        zipcode: '',
        state_code: '',
        latitude: '',
        longitude: '',
        address: ''
        };
        geocodeByAddress(merchant_address)
        .then((results) => {
            //console.log(merchant_address, results[0], results[0].formatted_address);
            data.address = results[0].formatted_address || '';
            return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
            //console.log(lat, lng, data.address);
            let matchExp = /(\d+) (.+?), (.+?), (.+?) ([0-9]{5})/g;
            if (matchExp.test(data.address)) {
                let delAddData = this.props.deliveryAddress;
                let addressArray = addressFormater(data.address);
                //console.log('Address : ', addressArray.formattedAddress);
                if (!isEmpty(addressArray) && addressArray.validAdrs) {
                    let formattedAddress = addressArray.formattedAddress || '';
                    self.setState({
                    search: {
                        ...this.state.search,
                        merchant_address: formattedAddress
                    }
                    }, function () {
                    self.props.searchFilter({
                        type: self.state.search.type,
                        value: formattedAddress,
                        user_type: this.props.userType
                    });
                    });
                } else {
                    notifyerror('Oops, that does not seem like a valid address. Please try again.');
                    self.setState({
                    /* errors: {
                            ...self.state.error,
                            recipient_address:"Invalid Address"
                    },
                    recipient_location: {} */
                    recipient_address: ''
                    });
                }
            }
        })
        .catch(error => {
            console.log('Error', error);
        });
    };

    handleRecipientChange = recipient_address => {
        //console.log('Recipient Address', recipient_address);
        this.setState({ search: { ...this.state.search, recipient_address: recipient_address } });
    };

    handleRecipientSelect = recipient_address => {
        //console.log('Merchant Address', merchant_address);
        let self = this;
        let data = {
        zipcode: '',
        state_code: '',
        latitude: '',
        longitude: '',
        address: ''
        };
        geocodeByAddress(recipient_address)
        .then((results) => {
            //console.log(merchant_address, results[0], results[0].formatted_address);
            data.address = results[0].formatted_address || '';
            return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
            //console.log(lat, lng, data.address);
            let matchExp = /(\d+) (.+?), (.+?), (.+?) ([0-9]{5})/g;
            if (matchExp.test(data.address)) {
                let delAddData = this.props.deliveryAddress;
                let addressArray = addressFormater(data.address);
                //console.log('Address : ', addressArray.formattedAddress);
                if (!isEmpty(addressArray) && addressArray.validAdrs) {
                    let formattedAddress = addressArray.formattedAddress || '';
                    self.setState({
                    search: {
                        ...this.state.search,
                        recipient_address: formattedAddress
                    }
                    }, function () {
                    self.props.searchFilter({
                        type: self.state.search.type,
                        value: formattedAddress,
                        user_type: this.props.userType
                    });
                    });
                } else {
                    notifyerror('Oops, that does not seem like a valid address. Please try again.');
                    self.setState({
                    /* errors: {
                            ...self.state.error,
                            recipient_address:"Invalid Address"
                    },
                    recipient_location: {} */
                    recipient_address: ''
                    });
                }
            }
        })
        .catch(error => {
            console.log('Error', error);
        });
    };

    componentWillUnmount() {
        this.props.resetSearch();
    }

    render () {
        //console.log(this.state.search);
        let startTimings        =   (!!this.timings && !!this.timings.from) ? this.timings.from : [];
        let endTimings          =   (!!this.timings && !!this.timings.to) ? this.timings.to : [];     
        let filteredData        =   this.state.filteredList || {};
        let filteredList        =   {};
        let filteredCount       =   0;
        if (!isEmpty(filteredData)) {
            filteredList        =   filteredData.tasks || {};
            filteredCount       =   filteredData.count || 0;
        }
        const rsSrchStyles      =   {
            input           :   {
                width       :   '260px',
                padding     :   '0px 15px 0px 35px',
                color       :   '#333',
                margin      :   '0'
            },
            autocompleteContainer   :   {
                borderRadius    :   '0 0 3px 3px',
                zIndex          :   '999',
                background      :   'url(/static/images/pow_google.jpg) no-repeat right bottom #fff',
                position        :   'relative',
                border          :   '1px solid #e8e8e8',
                boxShadow       :   '1px 5px 10px rgba(68,68,68,0.2)',
            },
            autocompleteItem    :   {
                textAlign       :   'left',
                fontSize        :   '12px',
                padding         :   '5px 8px 5px 30px',
                lineHeight      :   '20px',
                color           :   '#999',
                background      :   '10px 8px #fff',
                margin          :   '0',
                borderTop       :   'none',
                borderBottom    :   '1px solid #ccc',
                background      :   'url(/static/images/location_google.png) no-repeat 10px 8px #fff'
            },
            autocompleteItemActive  :   { color: '#E44500' }
        };

        const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
                <input
                {...getInputProps({
                    placeholder: 'Enter Address',
                    className: 't_box',
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
                            <span data="autosuggest">{suggestion.description}</span>
                        </div>
                    );
                })}
                </div>
            </div>
        );
        return (
            
            <div className={`searchMod_sec${(!!this.props.showSearch) ? '' : ' hide'}`}>
               <div className="s_bar">
                  <label>Search by:</label>
                  <Form method="get" action="" autoComplete="off">
                     <div
                        className={`select-box ${this.state.typeOpen ? " sopen" : " "}`}                        
                        onBlur={() => this.collapse('typeOpen')}
                     >
                        <div className="s-result" onClick={() => this.handleSelectbox('typeOpen')}>
                            <input type="text" autoComplete="off" readOnly value={this.state.search.label} name="searchType"/>
                        </div>
                        <ul className="selectchild">
                           <li onClick={() => this.changeSearchType({
                              type: 'order-number',
                              label: 'Order Number'
                           })}>Order Number</li>
                           {
                               (this.props.section !== 'All Tasks') ? 
                               <li onClick={() => this.changeSearchType({
                                    type: 'delivery-window',
                                    label: 'Delivery Window'
                                })}>Delivery Window</li> : null
                           }                           
                           <li onClick={() => this.changeSearchType({
                              type: 'merchant-address',
                              label: 'Merchant Address'
                           })}>Merchant Address</li>
                           <li onClick={() => this.changeSearchType({
                              type: 'recipient-address',
                              label: 'Recipient Address'
                           })}>Recipient Address</li>
                           <li onClick={() => this.changeSearchType({
                              type: 'driver',
                              label: 'Driver'
                           })}>Driver</li>
                           {/* <li>Task Status</li> */}
                        </ul>
                     </div>
                     <div className="resboxwrap">
                     <div className="search_box">
                           {
                              (['order-number', 'driver'].includes(this.state.search.type)) ?
                              <input type="text"autoComplete="off" placeholder="Search" name="searchTxt" value={this.state.search.text} onChange={this.handleSearch}/> : null
                           }
                           {                              
                              (this.state.search.type === 'delivery-window') ?
                              <div className="d_window">
                                 <select className="sdate" name="start_time" onChange={(e) => this.onSearchDelTime(e, 'start')} value={this.state.search.start_time}>
                                    <option>-- Select --</option>
                                    {
                                       (startTimings || []).map((v, k)    =>  {
                                          return (
                                             <option key={k} value={v.value}>{v.label}</option>
                                          )
                                       })
                                    }
                                 </select>
                                 <span>to</span> 
                                 <select className="edate" name="end_time" onChange={(e) => this.onSearchDelTime(e, 'end')} value={this.state.search.end_time}>
                                    <option>-- Select --</option>
                                    {
                                       (endTimings || []).map((v, k)    =>  {
                                          return (
                                             <option key={k} value={v.value}>{v.label}</option>
                                          )
                                       })
                                    }
                                 </select>
                              </div>: null
                           }
                           {
                              (this.state.search.type === 'merchant-address') ?
                              <PlacesAutocomplete
                                    value={this.state.search.merchant_address}
                                    onChange={this.handleChange}
                                    onSelect={this.handleSelect}
                                    styles={rsSrchStyles}
                              >
                                    {renderFunc}
                              </PlacesAutocomplete> : null
                           }                        
                           {
                              (this.state.search.type === 'recipient-address') ?
                              <PlacesAutocomplete
                                    value={this.state.search.recipient_address}
                                    onChange={this.handleRecipientChange}
                                    onSelect={this.handleRecipientSelect}
                                    styles={rsSrchStyles}
                              >
                                    {renderFunc}
                              </PlacesAutocomplete> : null
                           }
                        </div>
                     <button onClick={this.resetSearch} className="reset_btn" type="reset">Reset</button>
                     </div>
                  </Form>
               </div>
               <div className="s_result">                                           
                    <CustomContext
                        visible             =   {this.state.visible}
                        x                   =   {this.state.x}
                        y                   =   {this.state.y}
                        selOrder            =   {this.state.selOrder}
                        openEditWindow      =   {this.props.openEditWindow}
                        openDetailsWindow   =   {this.props.openDetailsWindow}
                        openMapWindow       =   {this.props.openMapWindow}
                        deleteTask          =   {this.props.deleteTask}
                        updateTask          =   {this.props.updateTask}
                        hideContextMenu     =   {this.hideContextMenu}
                    />
                    {
                        (filteredCount > 0) ? 
                        <div>
              {
                                    (!isEmpty(filteredList)) ?
                                    Object.keys(filteredList || {}).map((item, i) => {
                                        let cities = filteredList[item] || [];
                                        return (
                                            <section key={i} className="t_content">
                                                <h3 className="title">{item}</h3>
                                                {
                                                cities.map((city, index) => {
                                                    let orderList = city.orders || [];
                                                    return (
                                                        <div key={index} className="table_sec">
                                                            <table>
                                                                <thead>
                                                                    <tr>
                                                                        <th colSpan="7" className="t-titel">{city.name}</th>
                                                                    </tr>
                                                                    <tr className="t-heading">
                                                                        <th>Order Number</th>
                                                                        <th>Delivery Window</th>
                                                                        <th>Merchant Address</th>
                                                                        <th>Recipient Address</th>
                                                                        <th>Driver</th>
                                                                        <th>Task Status</th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        orderList.map((order, oIndex) => {
                                                                            //console.log('Onfleet : ', order);
                                                                            let clsName = getStatusClass(order.tsk_status);
                                                                            let merchant_address = `${order.mrchnt_address.number} ${order.mrchnt_address.street}, ${order.mrchnt_address.city}`;
                                                                            let recipient_address = `${order.recpnt_address.number} ${order.recpnt_address.street}, ${order.recpnt_address.city}`;
                                                                            return (
                                                                                <tr
                                                                                key={oIndex}
                                                                                onContextMenu={(e) => this.handleContextMenu(e, {
                                                                                    order_number: order.order_number,
                                                                                    order_id: order.id,
                                                                                    order_uuid: order.uuid,
                                                                                    tsk_status:order.tsk_status,
                                                                                    mrchnt_address: merchant_address,
                                                                                    recpnt_address: recipient_address
                                                                                })}>
                                                                                <td>{order.order_number}</td>
                                                                                <td>{order.complete_after} - {order.complete_before}</td>
                                                                                <td className="acell">
                                                                                    <label>{merchant_address}</label>
                                                                                    <span className="tTip">{merchant_address}</span>
                                                                                </td>
                                                                                <td className="acell">
                                                                                    <label>{recipient_address}</label>
                                                                                    <span className="tTip">{recipient_address}</span>
                                                                                </td>
                                                                                <td>{order.driver_name}</td>
                                                                                <td>
                                                                                    <span className={clsName}>{order.tsk_status}</span>
                                                                                </td>
                                                                                <td>
                                                                                        {
                                                                                            (!!order.track_driver && order.tsk_status !== 'Completed') ? 
                                                                                            <a onClick={(e)  => this.props.openTrackWindow(e, {
                                                                                                current_url: order.current_url,
                                                                                                track_driver: order.track_driver
                                                                                            })}>{order.track_driver}</a> : null
                                                                                        }
                                                                                        {/* <a href="/dashboard">{order.track_driver}</a> */}
                                                                                </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )
                                                })
                                                }
                                            </section>
                                        )
                                    })
                                    : null
                                }              <div className="resultCount">{filteredCount} SEARCH RESULT(S)</div>
                            <div className="t_result">
                                
                            </div>
                        </div> : <div className="noresult">Type to search and relevant results will appear</div>
                    }
                </div>
            </div>
        )
    }
}