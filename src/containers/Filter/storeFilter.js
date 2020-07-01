import React, { Component } from 'react';
import {sortBy as _sortBy} from 'lodash';
export default class StoreFilter extends Component {
    constructor(props) {
        super(props);
        this.state      =   {
            storeTxt: '',
            stOpen: false
        }
        this.dropdownInput = React.createRef();
    }   

    handleStoreChange = (e, store) => {
        this.setState({
            storeTxt    :   ''
        }, () => {
            this.dropdownInput.current.focus();
        })
        this.props.handleStoreChange(e, store);
    }
  
    onChangeHandle(e) {
       const name = e.target.name;
       const value = e.target.value;
       this.setState({
           [name]   :   value,
           stOpen   :   true
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
        if(this.nodeStore.contains(e.target)
        || e.target.getAttribute('data') === 'ignore-outer-click'){ return; }
		if(!!this.state.stOpen) {
            this.setState({
                stOpen      :   false,
                storeTxt    :   ''
            });
        }
    }
   
    handleSelectbox = () => {   
        if (this.props.area.length === 0)
            return;
        this.setState({
            stOpen      :  !this.state.stOpen
        })
        this.onChangeHandle     =   this.onChangeHandle.bind(this);
    }

    render() {
        let storeFilter = this.props.store.map(store => store.label);
        let unsortedStore       =   this.props.stores || [];
        let area                =   this.props.area || [];
        let filteredArea        =   (area.length > 0) ? area.map((item) => item.id.toString()) : [];
        //unsortedStore           =   unsortedStore.map((item) => filteredArea.includes(item.zoneid));
        let stores              =   _sortBy(unsortedStore, 'label');
        //console.log('Filtered Store : ', this.props.store);
        return (
            <div ref={nodeStore => this.nodeStore = nodeStore} className={`select-box${this.state.stOpen ? " sopen" : " "}`} onClick={this.handleSelectbox}>
                <div className={`s-result ${(this.props.area.length === 0) ? "dis":" "}`}>
                    <input type="text" ref={this.dropdownInput} autoComplete="off" disabled={(this.props.area.length === 0) ? true : false} placeholder="Store" name="storeTxt" value={this.state.storeTxt} onChange={this.onChangeHandle}/>
                </div>
                <ul className={(storeFilter.length > 0) ? 'selected' : ''}>
                {/* {
                    (this.props.store.length > 0) ?
                    this.props.store.map((filter, index) => {
                        return (
                            <li key={index + 'filtered'} data='ignore-outer-click' onClick={(e) => this.props.handleRemoveFilter(e, 'Store', index)} className="selected">{filter.label}</li>
                        )
                    }) : null
                } */}
                {
                    stores.map((store, i) => {
                        let exists  =    (!!store.zone_id) ? filteredArea.includes(store.zone_id.toString()) : '';
                        let index   =   storeFilter.indexOf(store.label);
                        //console.log('Store : ', exists, store.zone_id);
                        return (
                            (!!store.zone_id && !!exists && store.label.toLowerCase().includes(this.state.storeTxt.toLowerCase())) ?
                                (index > -1) ?
                                <li
                                    key={i}
                                    data='ignore-outer-click'
                                    onClick={(e) => this.props.handleRemoveFilter(e, 'Store', index)}
                                    className='selected'
                                >
                                    {store.label}
                                </li> : <li
                                    key={i}
                                    data='ignore-outer-click'
                                    onClick={(e) => this.handleStoreChange(e, {...store})}
                                >
                                    {store.label}
                                </li>
                            : null
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}