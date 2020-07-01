import React, {Component} from 'react';
import { getStatusClass } from '../../util/helper';
import { isEmpty, isEqual, map as _map } from 'lodash';

export default class StateWiseList extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      let taskList                  =  this.props.taskList || {};
      return (
         (!this.props.isProcessing) ? 
         Object.keys(taskList || {}).map((item, i) => {
            let orderList = taskList[item].orders || [];
            //console.log(item, orderList);
            return (
               <div key={i} className="table_sec">
                  <table>
                     <thead>
                        <tr>
                           <th colSpan="7" className="t-titel">{item}</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className="t-heading">
                           <th>Order Number</th>
                           <th>Delivery Window</th>
                           <th>Merchant Address</th>
                           <th>Recipient Address</th>
                           <th>Driver</th>
                           <th>Task Status</th>
                           <th></th>
                        </tr>
                        {
                           orderList.map((order, oIndex) => {
                              //console.log('Onfleet : ', order);
                              let clsName = getStatusClass(order.tsk_status);
                              let merchant_address = `${order.mrchnt_address.number} ${order.mrchnt_address.street}, ${order.mrchnt_address.city}`;
                              let recipient_address = `${order.recpnt_address.number} ${order.recpnt_address.street}, ${order.recpnt_address.city}`;
                              return (
                                 <tr
                                 key={oIndex}
                                 onContextMenu={(e) => this.props.handleContextMenu(e, {
                                       order_number: order.order_number,
                                       order_id: order.id,
                                       order_uuid: order.uuid,
                                       tsk_status:order.tsk_status,
                                       mrchnt_address: merchant_address,
                                       recpnt_address: recipient_address
                                 })}>
                                    <td>{order.order_number}</td>
                                    <td>{order.complete_after} - {order.complete_before}</td>
                                    <td className="acell">
                                          <label>{merchant_address}</label>
                                          <span className="tTip">{merchant_address}</span>
                                    </td>
                                    <td className="acell">
                                          <label>{recipient_address}</label>
                                          <span className="tTip">{recipient_address}</span>
                                    </td>
                                    <td>{order.driver_name}</td>
                                    <td>
                                          <span className={clsName}>{order.tsk_status}</span>
                                    </td>
                                    <td>
                                       {
                                          (!!order.track_driver && order.tsk_status !== 'Completed') ? 
                                          <a onClick={(e)  => this.props.openTrackWindow(e, {
                                                current_url: order.current_url,
                                                track_driver: order.track_driver
                                          })}>{order.track_driver}</a> : null
                                       }
                                       {/* <a href="/dashboard">{order.track_driver}</a> */}
                                    </td>
                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </table>
               </div>
            )
         }) : <div className="loader">Loading....</div>
      )
   }
}