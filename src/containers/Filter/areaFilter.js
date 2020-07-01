import React, { Component } from 'react';
import {sortBy as _sortBy} from 'lodash';
export default class AreaFilter extends Component {
    constructor(props) {
        super(props);
        this.state      =   {
            areaTxt: '',
            aOpen: false
        }
        this.dropdownInput = React.createRef();
    }   

    handleAreaChange = (e, data) => {
        this.setState({
            areaTxt    :   ''
        }, () => {
            this.dropdownInput.current.focus();
        })
        this.props.handleAreaChange(e, data);
    }
  
    onChangeHandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]  :   value,
            aOpen   :   true
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
        if(this.nodeArea.contains(e.target)
        || e.target.getAttribute('data') === 'ignore-outer-click'){ return; }
		if(!!this.state.aOpen) {
            this.setState({
                aOpen       :   false,
                areaTxt     :   ''
            });
        }
    }
   
    handleSelectbox = () => {   
        if (this.props.states.length === 0)
            return;
        this.setState({
            aOpen      :  !this.state.aOpen
        })
    }

    render() {
        let areaFilter = this.props.area.map(area => area.value);
        let zones                   =   this.props.zones || {};
        let stateCodeFilter         =   this.props.stateCodeFilter || [];
        let unsortedZoneList        = stateCodeFilter.map(state => {
            return { state: state, zones: zones[state] }
        });
        let zoneList                  =   _sortBy(unsortedZoneList, 'state');
        return (
            <div ref={nodeArea => this.nodeArea = nodeArea} className={`select-box${this.state.aOpen ? " sopen" : " "}`} onClick={this.handleSelectbox}>
                <div className={`s-result ${(this.props.states.length === 0) ? "dis":" "}`}>
                    <input type="text" ref={this.dropdownInput} autoComplete="off" disabled={(this.props.states.length === 0) ? true : false} placeholder="Area" name="areaTxt" value={this.state.areaTxt} onChange={this.onChangeHandle}/>
                </div>
                <ul className={(areaFilter.length > 0) ? 'selected' : ''}>
                {/* {
                    (this.props.area.length > 0) ?
                    this.props.area.map((filter, index) => {
                        return (
                            <li key={index + 'filtered'} data='ignore-outer-click' onClick={(e) => this.props.handleRemoveFilter(e, 'Area', index)} className="selected">{filter.label}</li>
                        )
                    }) : null
                } */}
                {
                    (zoneList || []).map((item, i) => {  
                        let zones   =   item.zones || [];
                        zones       =   _sortBy(zones, 'delivery_zone_name');
                        return (
                            zones.map((zone, k) => {
                            let index   =   areaFilter.indexOf(zone.delivery_zone_name);
                            return (                                                   
                                (zone.delivery_zone_name.toLowerCase().includes(this.state.areaTxt.toLowerCase())) ?
                                    (index > -1) ?
                                    <li
                                        key={k}
                                        data='ignore-outer-click'
                                        onClick={(e) => this.props.handleRemoveFilter(e, 'Area', index)}
                                        className='selected'
                                    >
                                        {zone.delivery_zone_name} ({item.state})
                                    </li> : <li
                                        key={k}
                                        data='ignore-outer-click'
                                        onClick={(e) => this.handleAreaChange(e, {...zone, state: item.state})}
                                    >
                                        {zone.delivery_zone_name} ({item.state})
                                    </li>
                                : null
                            )
                            })
                        )
                    })
                }
                </ul>
            </div>        
        )
    }
}