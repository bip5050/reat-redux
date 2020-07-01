import React, { Component } from 'react';
import {sortBy as _sortBy} from 'lodash';
export default class StateFilter extends Component {
    constructor(props) {
        super(props);
        this.state      =   {
            stateTxt: '',
            sOpen: false
        }
        this.dropdownInput = React.createRef();
    } 

    handleStateChange = (e, state) => {
        this.setState({
            stateTxt    :   ''
        }, () => {
            this.dropdownInput.current.focus();
        })
        this.props.handleStateChange(e, state);
    }   
  
    onChangeHandle = (e) => {
        const name      =   e.target.name;
        const value     =   e.target.value;
        this.setState({
            [name]      :   value,
            sOpen       :   true
        });
    }

    componentDidMount() {
        //console.log(this.props);
        document.addEventListener('click', this.handleClick);
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    };
     
    handleClick = (e) => {
        e.stopPropagation();
        if(this.nodeState.contains(e.target)
        || e.target.getAttribute('data') === 'ignore-outer-click'){ return; }
		if(!!this.state.sOpen) {
            this.setState({
                sOpen       :   false,
                stateTxt    :   ''
            }); 
        }
    }
   
    handleSelectbox = () => {   
        //console.log('Select Box : ')
        this.setState({
            sOpen      :  !this.state.sOpen
        })
    }

    render() {
        let statesLocalStorage     =  JSON.parse(localStorage.getItem('states') || '[]');      
        let unsortedStates         =  statesLocalStorage.map((item) => {
            return {
                label: item.value,
                value: item.id
            }
        })
        let states                  =   _sortBy(unsortedStates, 'value');
        let stateFilter             =   this.props.stateFilter || [];
        return (            
            <div ref={nodeState => this.nodeState = nodeState} className={`select-box${this.state.sOpen ? " sopen" : " "}`}>
                <div className="s-result" onClick={this.handleSelectbox}>
                <input type="text" ref={this.dropdownInput} autoComplete="text" placeholder="State" name="stateTxt" value={this.state.stateTxt} onChange={this.onChangeHandle}/>
                </div>
                <ul className={(stateFilter.length > 0) ? 'selected' : ''}>
                {/* {
                    (this.props.states.length > 0) ?
                    this.props.states.map((filter, index) => {
                        return (
                        <li key={index + 'filtered'} data='ignore-outer-click' onClick={(e) => this.props.handleRemoveFilter(e, 'State', index)} className="selected">{filter.label}</li>
                        )
                    }) : null
                } */}
                {
                    (states || []).map((state, i) => {      
                        let index       =   stateFilter.indexOf(state.label);                  
                        return (
                            (state.label.toLowerCase().includes(this.state.stateTxt.toLowerCase())) ?
                            (index > -1) ?
                                <li
                                    key={i}
                                    data='ignore-outer-click'
                                    onClick={(e) => this.props.handleRemoveFilter(e, 'State', index)}
                                    className='selected'
                                >
                                    {state.label}
                                </li> : <li
                                    key={i}
                                    data='ignore-outer-click'
                                    onClick={(e) => this.handleStateChange(e, {...state})}
                                >
                                    {state.label}
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