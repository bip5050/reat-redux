import React, {Component} from 'react';
import { getStatusClass, getTaskStatus } from '../../util/helper';
import { isEmpty, isEqual, map as _map } from 'lodash';
import { convertTwoDecimalRound } from '../../Helper/common';

export default class UncategorizedList extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      let tasks                  =  this.props.tasks || {};  
      let orderList              =  tasks.orders || [];
      let shoppedLateData        =  this.props.shoppedLate || {};
      let shoppedLateSummary     =  shoppedLateData.summary || {};
      let shoppedLate            =  0;
      let totalShopped           =  0;
      let shoppedLatePerc        =  0;
      if(!isEmpty(shoppedLateSummary) && shoppedLateData.type === 'default') {
         totalShopped            =  shoppedLateSummary.total_orders;
         shoppedLate             =  shoppedLateSummary.shopped_late;
         shoppedLatePerc         =  convertTwoDecimalRound(shoppedLateSummary.shopping_late_percent);
      }
      //let shoppedLatePerc  =  convertTwoDecimalRound((tasks.totShoppedLate > 0 && tasks.total >= 0)? (tasks.totShoppedLate * 100)/tasks.total : 0);
      return (
         (!isEmpty(tasks)) ?
               <section className="content">
                  <div className="table_sec dboardtable">
                     <table>
                     <thead>
                           <tr>
                              <th colSpan="8" className="t-titel"><span className="aOrder">All Orders</span>
                                 <div className="status_count">
                                       <span className="fc_black"> Total: {tasks.total}</span>
                                       <span className="fc_green">Ready: {tasks.ready}</span>
                                       <span className="fc_yellow">Shopping: {tasks.shopping}</span>
                                       <span className="fc_read">Not Ready: {tasks.not_ready}</span>
                                       <span className="fc_gray"> Shopped Late: {shoppedLatePerc}% ({shoppedLate}/{totalShopped})</span>
                                 </div>
                              </th>
                           </tr>
                           </thead>
                           <tbody>
                           <tr className="t-heading">
                              <th>Order Number</th>
                              <th>Delivery Window</th>
                              <th>Merchant Address</th>
                              <th>Recipient Address</th>
                              <th>Driver</th>
                              <th>Shopped Late</th>
                              <th>Task Status</th>
                              <th></th>
                           </tr>
                           {
                              (orderList.length > 0) ?
                              orderList.map((order, oIndex) => {
                                 let ordClsName  =   '';
                                 if(order.order_status === 'R' || order.order_status === 'F' || order.order_status === 'Y'){
                                       ordClsName  =   'ready';
                                 } else if(order.order_status === 'W') {
                                       ordClsName  =   'shopping';
                                 }
                                 else {
                                       ordClsName  =   'not_ready';
                                 }
                                 let shoppedLate         =  'No';
                                 let shoppedLateCls      =  'fcGray';
                                 if(order.shoppedLate > 0) {
                                    shoppedLate    = order.shoppedLate + ' min';
                                    if(order.shoppedLate >= 30)
                                       shoppedLateCls    =  'fcRed';
                                    else 
                                       shoppedLateCls    =  'fcBlack';
                                 }
                                 //console.log('Onfleet : ', order.order_status, ordClsName);
                                 let clsName    =  getStatusClass(order.tsk_status);
                                 return (
                                       <tr
                                          key={oIndex}
                                          onContextMenu={(e) => this.props.handleContextMenu(e, {
                                             order_number: order.order_number,
                                             order_id: order.id,
                                             order_uuid: order.uuid,
                                             tsk_status: order.tsk_status,
                                             mrchnt_address: order.mrchnt_address,
                                             recpnt_address: order.recpnt_address
                                          })}>
                                          <td abbr="tr">
                                             <span className={`round ${ordClsName}`}></span>
                                             {order.order_number}
                                          </td>
                                          <td abbr="tr">{order.complete_after} - {order.complete_before}</td>
                                          <td abbr="tr" className="acell"><label>{order.mrchnt_address.toString()}</label> <span className="tTip">{order.mrchnt_address.toString()}</span></td>
                                          <td abbr="tr" className="acell"><label>{order.recpnt_address.toString()}</label><span className="tTip">{order.recpnt_address.toString()}</span></td>
                                          <td abbr="tr">{order.driver_name}</td>
                                          <td abbr="tr">
                                             <span className={shoppedLateCls}>{shoppedLate}</span>
                                          </td>
                                          <td className="react-contextmenu-wrapper" id="some_unique_identifier">
                                             <span className={clsName}>{order.tsk_status}</span>                           
                                          </td>
                                          <td>
                                             {
                                                   (!!order.track_driver && order.tsk_status !== 'Completed') ? 
                                                   <a onClick={(e)  => this.props.openTrackWindow(e, {
                                                      current_url: order.current_url,
                                                      track_driver: order.track_driver
                                                   })}>Track Driver</a> : null
                                             }
                                          </td>
                                       </tr>
                                 )
                              }) : <tr><td align="center" colSpan="7">No Record(s)</td></tr>
                           }
                           </tbody>
                     </table>
                  </div>
               </section>
            : <section className="content"><div className="loader">Loading....</div></section>
      )
   }
}