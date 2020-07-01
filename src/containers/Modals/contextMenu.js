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
        this.openEditWindow     =   this.openEditWindow.bind(this);
        this.updateTask         =   this.updateTask.bind(this);
    }

    openEditWindow(uuid, mrchnt_address, recpnt_address, tsk_status){
        /* console.log('Task Status : ', tsk_status);
        if(tsk_status === 'Scheduled') {
            this.props.openEditWindow(uuid, mrchnt_address, recpnt_address);
        }
        else {
            notifysuccess({message: `Task is already in ${tsk_status} mode.`});
        } */
        this.props.openEditWindow(uuid, mrchnt_address, recpnt_address);
    }

    updateTask(uuid, status, tsk_status){
        console.log('Task Status : ', tsk_status);
        if(tsk_status === 'Scheduled') {
            this.props.updateTask(uuid, status);
        }
        else {
            notifysuccess({message: `Task is already in ${tsk_status} mode.`});
        }
    }

    componentDidMount(){
        var self            =   this;       
        document.addEventListener("click", function(event){
            event.stopPropagation();
            self.props.hideContextMenu();
            /* self.setState({
                visible: false,
                x:0,
                y:0
            }, () => {
            }); */
        });
    }

    componentWillReceiveProps(props) {
        //console.log('Context Props : ', props);
        this.setState({
            visible     :   props.visible,
            x           :   props.x,
            y           :   props.y,
            selOrder    :   props.selOrder
        })
    }

    componentWillUnmount() {
        document.removeEventListener("click", function(){
            //console.log('Hide Context Menu ', this.state);
        });
    }

    render() {        
        var myStyle     =   {
            "position"  :   "absolute",
            "top"       :   `${this.state.y}px`,
            "left"      :   `${this.state.x+5}px`
        }
        let order           =   this.props.selOrder || {};
        let items           =   [
                                    {"label"        :   "Order #" + order.order_number},
                                    {"label"        :   "View Task"},
                                    {"label"        :   "View Map"},
                                    {"label"        :   "Edit Task"},
                                    {"label"        :   "Delete Task"},
                                    {
                                        "label"     :   "Change Status",
                                        "submenu"   :   ["Processing", "Picked up"]
                                    },
                                    {"label"        :   " "}
                                ];

        //console.log('Context Menu : ', (!!this.props.selOrder) ? this.props.selOrder.tsk_status : '');
        return (
            (!isEmpty(this.props.selOrder)) ?
            <div id="cmenu" ref={this.contextDiv}>
                {
                    this.state.visible ? 
                    <div className="custom-context" id="text" style={myStyle}>
                        <div className="custom-context-item">{`Order #${order.order_number}`}</div>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.openDetailsWindow(order.order_uuid)}>View Task</div>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.openMapWindow(order.order_uuid)}>View Map</div>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.openEditWindow(order.order_uuid, order.mrchnt_address, order.recpnt_address, order.tsk_status)}>Edit Task</div>
                        <div data="ignore-outer-click" className="custom-context-item" onClick={() => this.props.deleteTask(order.order_uuid)}>Delete Task</div>
                        <div className="custom-context-item">
                            Change Status
                            <ul>
                                <li data="ignore-outer-click" onClick={() => this.updateTask(order.order_uuid, 'R', order.tsk_status)}>Ready</li>
                                <li data="ignore-outer-click" onClick={() => this.updateTask(order.order_uuid, 'W', order.tsk_status)}>Work In Progress</li>
                            </ul>
                        </div>
                    </div>
                    : null
                }
            </div> : null
        )
    }
}
export default CustomContext;