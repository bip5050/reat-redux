import React, { Component } from 'react';
import {sortBy as _sortBy} from 'lodash';
export default class LocationDropdown extends Component {
    constructor(props) {
        super(props);
        this.state      =   {
            locationTxt: '',
            selLocaTxt: '',
            lOpen: false
        }
    }   
  
    onChangeHandle = (e) => {
       const name = e.target.name;
       const value = e.target.value;
       this.setState({
           [name]   :   value,
           lOpen   :   true
        });
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClick);
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    };
     
    handleClick = (e) => {
        e.stopPropagation();
        if(this.nodeAddress.contains(e.target)
        || e.target.getAttribute('data') === 'ignore-outer-click'){ return; }
		if(!!this.state.lOpen) {
            this.setState({
                lOpen       :   false,
                locationTxt :   this.state.selLocaTxt
            });
        }
    }
   
    handleSelectbox = () => {
        this.setState({
            lOpen      :  !this.state.lOpen,
            locationTxt :   (!!this.state.lOpen) ? this.state.selLocaTxt : ''
        })
        //this.onChangeHandle     =   this.onChangeHandle.bind(this);
    }

    componentWillReceiveProps(props) {
        let selId           =   props.selected || '';     
        if(!!selId && selId > 0) {
            let selectedIndex       =   (props.locations || []).findIndex(item => item.id === selId)
            let selectedLocation    =   props.locations[selectedIndex].label;
            this.setState({
                locationTxt :   selectedLocation,
                selLocaTxt  :   selectedLocation
            })
        } else {
            this.setState({
                selLocaTxt : ''
            })
        }
    }

    render() {
        let unsortedLocations       =   this.props.locations || [];
        let locations               =   _sortBy(unsortedLocations, 'label');
        return (
            <div ref={nodeAddress => this.nodeAddress = nodeAddress} className={`select-box${this.state.lOpen ? " sopen" : " "}`} onClick={this.handleSelectbox}>
                <div className="s-result"><input type="text" className={this.props.className} autoComplete="text" placeholder="Address" name="locationTxt" value={this.state.locationTxt} onChange={this.onChangeHandle}/></div>
                <ul>
                {
                    locations.map((location, i) => {
                        return (
                            (location.label.toLowerCase().includes(this.state.locationTxt.toLowerCase())) ?
                            <li key={i} data='ignore-outer-click' onClick={(e) => this.props.handleLocationChange({...location}, i)}>{location.label}</li> : null
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}