import React, { Component } from 'react';
import {success as notifysuccess} from '../../util/notify';
import {isEmpty} from 'lodash';

class CustomContext extends Component{
    constructor(props) {
        super(props);
        this.state      =   {
            visible     :   false,
            x           :   0,
            y           :   0
        };
        this.contextDiv = React.createRef();
    }

    componentDidMount(){
        var self            =   this;       
        document.addEventListener("click", function(event){
            event.stopPropagation();
            self.props.hideContextMenu();
        });
    }

    componentWillReceiveProps(props) {
        //console.log('Context Props : ', props);
        this.setState({
            visible     :   props.visible,
            x           :   props.x,
            y           :   props.y,
            store       :   props.store
        })
    }

    componentWillUnmount() {
        document.removeEventListener("click", function(){
            //console.log('Hide Context Menu ', this.state);
        });
    }

    render() {     
        //console.log('Context Menu : ', this.props);
        var myStyle     =   {
            "position"  :   "absolute",
            "top"       :   `${this.state.y}px`,
            "left"      :   `${this.state.x+5}px`
        }
        let store           =   this.props.store || {};
        return (
            (!isEmpty(this.props.store)) ?
            <div id="cmenu" ref={this.contextDiv}>
                {
                    this.state.visible ? 
                    <div className="custom-context" id="text" style={myStyle}>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.edit(store)}>Edit</div>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.delete(store.id)}>Delete</div>
                    </div>
                    : null
                }
            </div> : null
        )
    }
}
export default CustomContext;