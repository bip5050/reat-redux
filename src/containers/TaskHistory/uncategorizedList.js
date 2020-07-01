import React, {Component} from 'react';
import { getStatusClass, getTaskStatus } from '../../util/helper';
import { getDateTime, getSysDateTime } from '../../Helper/common';
import { isEmpty, isEqual, map as _map } from 'lodash';

export default class UncategorizedList extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      let taskList                  =  this.props.taskList || {};
      return (
         (!this.props.isProcessing) ? 
         <div className="table_sec">
               <table>
                  <thead>
                     <tr>
                        <th colSpan="7" className="t-titel">All Tasks</th>
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
                        taskList.map((order, oIndex) => {
                           let status              =  getTaskStatus(order.tskStatus);
                           let clsName             =  getStatusClass(status);
                           let merchant_address    =  `${order.merchant.address.number} ${order.merchant.address.street}, ${order.merchant.address.city}`;
                           let recipient_address   =  `${order.recipients.address.number} ${order.recipients.address.street}, ${order.recipients.address.city}`;
                           let completeafter       =  '';
                           let completebefore      =  '';
                           if(order.timezone !== '') {
                              completeafter = getDateTime(parseInt(order.completeAfter) * 1000, order.timezone, 'MM/DD · hh:mma');
                              completebefore = getDateTime(parseInt(order.completeBefore) * 1000, order.timezone, 'hh:mma');
                           } else {
                              completeafter = getSysDateTime(parseInt(order.completeAfter) * 1000, 'MM/DD · hh:mma');
                              completebefore = getSysDateTime(parseInt(order.completeBefore) * 1000, 'hh:mma');
                           }
                           return (
                           <tr
                              key={oIndex}
                              onContextMenu={(e) => this.props.handleContextMenu(e, {
                                    order_number: order.orderNumber,
                                    order_id: order.id,
                                    order_uuid: order.uuid,
                                    tsk_status:order.tskStatus,
                                    mrchnt_address: merchant_address,
                                    recpnt_address: recipient_address
                              })}>
                                 <td>{order.orderNumber}</td>
                                 <td>{completeafter} - {completebefore}</td>
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
                                       <span className={clsName}>{status}</span>
                                 </td>
                                 <td>
                                    {
                                       (!!order.track_driver && status !== 'Completed') ? 
                                       <a onClick={(e)  => this.props.openTrackWindow(e, {
                                             current_url: order.current_url,
                                             track_driver: order.track_driver
                                       })}>{order.track_driver}</a> : null
                                    }
                                 </td>
                              </tr>
                           )
                        })
                     }
                  </tbody>
               </table>
            </div>
         : <div className="loader">Loading....</div>
      )
   }
}