import React, { Component } from 'react';
import {sortBy as _sortBy} from 'lodash';
export default class StoreDropdown extends Component {
    constructor(props) {
        super(props);
        this.state      =   {
            storeTxt: '',
            selStoreTxt: '',
            stOpen: false
        }
    }   
  
    onChangeHandle = (e) => {
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
                storeTxt    :   this.state.selStoreTxt
            });
        }
    }
   
    handleSelectbox = () => {
        this.setState({
            stOpen      :  !this.state.stOpen,
            storeTxt    :   (!!this.state.stOpen) ? this.state.selStoreTxt : ''
        })
        //this.onChangeHandle     =   this.onChangeHandle.bind(this);
    }

    componentWillReceiveProps(props) {
        let selId           =   props.selected || '';     
        if(!!selId) {
            let selectedIndex   =   (props.stores || []).findIndex(item => item.id === selId)
            let selectedStore   =   props.stores[selectedIndex].label;
            this.setState({
                storeTxt        :   selectedStore,
                selStoreTxt     :   selectedStore
            })
        } else {
            this.setState({                
                selStoreTxt     :   ''
            })
        }
    }

    render() {
        let unsortedStore           =   this.props.stores || [];
        let stores                  =   _sortBy(unsortedStore, 'label');
        return (
            <div ref={nodeStore => this.nodeStore = nodeStore} className={`select-box${this.state.stOpen ? " sopen" : " "}`} onClick={this.handleSelectbox}>
                <div className="s-result"><input type="text" className={this.props.className} autoComplete="text" placeholder="Store" name="storeTxt" value={this.state.storeTxt} onChange={this.onChangeHandle}/></div>
                <ul>
                {
                    stores.map((store, i) => {
                        return (
                            (store.label.toLowerCase().includes(this.state.storeTxt.toLowerCase())) ?
                            <li key={i} data='ignore-outer-click' onClick={(e) => this.props.handleStoreChange({...store}, i)}>{store.label}</li> : null
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}