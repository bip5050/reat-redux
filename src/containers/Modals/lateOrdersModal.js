import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col, Button } from 'reactstrap';
import Pagination from '../../Helper/pagination';
import {isEmpty} from 'lodash';
import {getDetails} from './orderDetailsTemplate';

class LateOrdersModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showLateOrderModal: false,
            showDetails: false
        };
    };

    openDetailsWindow = (uuid) => {
		this.props.getTaskDetails({uuid: uuid})
		this.setState({
            showDetails: true
		})
	}

    backToList = () => {
		this.setState({
            showDetails: false
		})
	}

    changePage = (data) => {
        const { currentPage }	=	data;
        //console.log('Change Page : ', !!this.props.lateOrder && !isEmpty(this.props.lateOrder) && currentPage !== this.props.lateOrder.pageno, currentPage, this.props.lateOrder.pageno);
        if(!!this.props.lateOrder && !isEmpty(this.props.lateOrder) && currentPage !== this.props.lateOrder.pageno) {
            this.props.pageChangeLateOrders({
                page: currentPage,
                order_by : this.props.lateOrder.sortBy,
                format  : this.props.lateOrder.format
            });
            //this.props.getLateOrders(currentPage);
        }
    }

    sortBy = (value) => {
        //console.log(this.props.lateOrder.sortBy, value);
        let format  =   'asc';//this.state.format || 
        if(this.props.lateOrder.sortBy === value)
            format  =   (this.props.lateOrder.format === 'desc') ? 'asc' : 'desc';
        this.props.sortLateOrders({
            page: this.props.lateOrder.pageno,
            order_by : value,
            format : format,
            //format : (value === 'time_diff') ? 'desc' : 'asc'
        });
    }
    
    render() {
        //console.log('Tasks : ', this.props.isLoading);
        let lateOrders          =   this.props.lateOrder || {};
        let sortByValue         =   lateOrders.sortBy || 'complete_before';
        let format              =   lateOrders.format || 'complete_before';
        let tasks               =   lateOrders.tasks || {};
        let states              =   JSON.parse(localStorage.getItem('states') || '{}');
        
        let itemsPerPage        =   500;
        let totalRecords        =   lateOrders.count || 0;
        let taskDetails         =   this.props.taskDetails || {};
        return (
            (this.state.showDetails) ? 
            <Modal size="md" className="c-modal lomod" show={this.state.showDetails} onHide={this.props.handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Late Orders</Modal.Title>
                </Modal.Header>
                <a onClick={this.backToList} className="backorder" ><img src="/assets/arrow-left.svg" /> Go back</a>
                {getDetails(taskDetails)} 
            </Modal>
            :
            <Modal size="lg" className="c-modal lorderMod" show={this.props.showLateOrderModal} onHide={this.props.handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Late Orders</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                    (!this.props.isLoading) ?
                        <Row noGutters>
                            {
                                (lateOrders.listType === 'Uncategorized') ? 
                                    <Col md="12" sm="12" className="c_info">
                                        <div className="liveOrders">{lateOrders.count} Results</div>
                                        <div className="table_sec">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th colSpan="9" className="t-titel">
                                                            <div className="status_count">
                                                                <span className="fc_black">Total: {tasks.total}</span>
                                                                <span className="fc_green">0-20 mins: {tasks.b}</span>
                                                                <span className="fc_yellow">20-30 min: {tasks.c}</span>
                                                                <span className="fc_read">30+ min: {tasks.d}</span>
                                                            </div>
                                                        </th>
                                                    </tr>                                                
                                                </thead>
                                                <GetTableRows orderList={tasks.orders} openDetailsWindow={this.openDetailsWindow} sortBy={this.sortBy} sortByValue={sortByValue} format={format}/>
                                            </table>                          
                                        </div>
                                    </Col>
                                : null
                            }

                            {
                                (lateOrders.listType === 'Statewise') ? 
                                    <Col md="12" sm="12" className="c_info">
                                        <div className="liveOrders">{lateOrders.count} Results</div>
                                        {
                                            Object.keys(tasks || {}).map((item, i) => {
                                                let task        =   tasks[item] || {};
                                                return (                                                    
                                                    <div key={i} className="table_sec">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="9" className="t-titel"><span className="tName">{task.name}</span>
                                                                        <div className="status_count">
                                                                            <span className="fc_black">Total: {task.total}</span>
                                                                            <span className="fc_green">0-20 mins: {task.b}</span>
                                                                            <span className="fc_yellow">20-30 min: {task.c}</span>
                                                                            <span className="fc_read">30+ min: {task.d}</span>
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            
                                                            </thead>
                                                            <GetTableRows orderList={task.orders} openDetailsWindow={this.openDetailsWindow} sortBy={this.sortBy} sortByValue={sortByValue} format={format}/>
                                                        </table>                          
                                                    </div>                                                
                                                )
                                            })
                                        }
                                    </Col>
                                : null
                            }

                            {                                
                                (lateOrders.listType === 'Zonewise') ? 
                                
                                <Col md="12" sm="12" className="c_info">
                                    <div className="liveOrders">{lateOrders.count} Results</div>
                                    {
                                        Object.keys(lateOrders.tasks || {}).map((item, i) => {
                                            let zone     =  lateOrders.tasks[item] || [];
                                            let state    =   states.find(s => {
                                                return s.id === item;
                                            })
                                            return (
                                                <div key={i}>
                                                    <h3 className="title">{state.value || item}</h3>
                                                    <div className="table_sec">
                                                {    
                                                    zone.map((z, index) => {
                                                        let orderList  =  z.orders || [];
                                                        return (
                                                            <table key={index}>
                                                                <thead>
                                                                    <tr>
                                                                        <th colSpan="9" className="t-titel"><span className="tName">{z.name} ({item})</span>
                                                                            <div className="status_count">
                                                                                <span className="fc_black">Total: {z.total}</span>
                                                                                <span className="fc_green">0-20 mins: {z.b}</span>
                                                                                <span className="fc_yellow">20-30 min: {z.c}</span>
                                                                                <span className="fc_read">30+ min: {z.d}</span>
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                
                                                                </thead>
                                                                <GetTableRows orderList={orderList} openDetailsWindow={this.openDetailsWindow} sortBy={this.sortBy} sortByValue={sortByValue} format={format}/>
                                                            </table>
                                                        )
                                                    })
                                                }
                                                </div>
                                                </div>
                                            )
                                        })
                                    }
                                </Col>
                                : null
                            }
                        </Row>
                        : <Row noGutters>
                            <Col md="12" sm="12" className="c_info">
                                <div className="loader">Loading....</div>
                            </Col>
                        </Row>
                    }                   
                    {
                        (!isEmpty(tasks) && totalRecords >= itemsPerPage) ?
                        <div style={{display: (this.props.isLoading) ? 'none' : ''}} className="pagination_Pan"><Pagination totalRecords={totalRecords} pageLimit={itemsPerPage} pageNeighbours={1} onPageChanged={this.changePage} isProcessing={this.props.isProcessing}/></div>:null
                    }
                </Modal.Body>
            </Modal>
        )
    }
}
export default LateOrdersModal;

function GetTableRows(props){
    let orderList   =   props.orderList || [];
    let sortBy      =   props.sortByValue;
    let format      =   props.format;
    return (        
        <tbody>
            <tr className="t-heading">
                <th className={(sortBy === 'order_number') ? `sortby ${format}`: ''} onClick={() => props.sortBy('order_number')}>Order Number</th>
                <th className={(sortBy === 'time_diff') ? `sortby ${format}`: ''} onClick={() => props.sortBy('time_diff')}>Late by (min)</th>
                <th className={(sortBy === 'store') ? `sortby ${format}`: ''} onClick={() => props.sortBy('store')}>Store</th>
                <th className={(sortBy === 'cust_name') ? `sortby ${format}`: ''} onClick={() => props.sortBy('cust_name')}>Customer Name</th>
                <th className={(sortBy === 'created_at') ? `sortby ${format}`: ''} onClick={() => props.sortBy('created_at')}>Order Time</th>
                <th className={(sortBy === 'complete_after' || sortBy === 'complete_before') ? `sortby ${format}`: ''} onClick={() => props.sortBy('complete_before')}>Last Del Window</th>
                <th className={(sortBy === 'recpnt_task_start_time') ? `sortby ${format}`: ''} onClick={() => props.sortBy('recpnt_task_start_time')}>Driver to Recipient</th>
                <th className={(sortBy === 'delivery_time') ? `sortby ${format}`: ''} onClick={() => props.sortBy('delivery_time')}>Delivery Time</th>
                <th className={(sortBy === 'driver_wait') ? `sortby ${format}`: ''} onClick={() => props.sortBy('driver_wait')}>Driver Wait</th>
            </tr>
            {
                (orderList.length > 0) ?
                (orderList || []).map((order, oIndex) => {
                    return (                                                                
                        <tr key={oIndex}>
                            <td abbr="tr">
                                <span className={`round ${order.lateClass}`}></span>{order.order_number}
                                &nbsp;
                                <span title="View Details" onClick={() => props.openDetailsWindow(order.uuid)} className="docmodbtn"><img src="/assets/doc.svg" /></span>
                            </td>
                            <td abbr="tr">{(order.time_diff > 0) ? order.time_diff : 0}</td>
                            <td abbr="tr">{order.store}</td>
                            <td abbr="tr">{order.customer_name}</td>
                            <td abbr="tr" className="acell" ><span className="tTip">{order.created_at}</span> <label>{order.created_at}</label></td>
                            <td abbr="tr" className="acell" ><span className="tTip">{order.complete_before}</span> <label>{order.complete_before}</label></td>
                            <td abbr="tr" className="acell" ><span className="tTip">{order.recpnt_task_start_time}</span> <label>{order.recpnt_task_start_time}</label></td>
                            <td abbr="tr" className="acell" ><span className="tTip">{order.delivery_time}</span> <label>{order.delivery_time}</label></td>
                            <td abbr="tr">{order.driver_wait}</td>
                        </tr>
                    )
                }) : <tr>
                    <td colSpan="9">No Record(s)</td>
                </tr>
            }
        </tbody>

    )
}