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
    };

    componentDidMount(){
        var self            =   this;       
        document.addEventListener("click", function(event){
            event.stopPropagation();
            self.props.hideContextMenu();
        });
    };

    componentWillReceiveProps(props) {
        this.setState({
            visible     :   props.visible,
            x           :   props.x,
            y           :   props.y,
            itemObj     :  props.itemObj
        })
    };

    componentWillUnmount() {
        document.removeEventListener("click", function(){});
    };

    render() {   
        var myStyle = {
            "position"  :   "absolute",
            "top"       :   `${this.state.y}px`,
            "left"      :   `${this.state.x+5}px`
        };

        return (
            (!isEmpty(this.state.itemObj)) ?
            <div id="cmenu" ref={this.contextDiv}>
                {
                    this.state.visible ? 
                    <div className="custom-context" id="text" style={myStyle}>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.handleShowUserModel('EDIT', this.state.itemObj.id)}>Edit User</div>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.handleShowUserModel('DELETE', this.state.itemObj.id)}>Delete User</div>

                        {
                            (this.state.itemObj.active === "true")?
                            <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.handleShowUserModel('SUSPEND', this.state.itemObj.id)}>Suspended User</div>
                            :<div data="ignore-outer-click" className="custom-context-item" style={{color: '#B6B6B6'}}>Suspended User</div>
                        }
                    </div>
                    : null
                }
            </div> : null
        )
    }
}
export default CustomContext;