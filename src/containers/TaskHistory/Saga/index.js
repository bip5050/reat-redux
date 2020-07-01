import { takeEvery, put, call } from 'redux-saga/effects';
import * as taskHistoryConstant from '../constants';
import {error as notifyerror} from '../../../util/notify';
import * as taskHistoryAction from '../actions';
import {callApiV2} from '../../../Helper/api';
import * as _ from 'lodash';
import { getDateTime, getSysDateTime } from '../../../Helper/common';
import * as headerAction from '../../Header/actions';

//Get History
export function* get_history(action){
    try {        
        let url             =   '';
        url                 =   `tasks/history`;
        let actionData      =   action.data;
        //let filterData      =   getFilter('history');
        //console.log('Filter Data : ', actionData);
        yield put(headerAction.syncFilter({key: actionData.filter.key || 'history', value: JSON.parse(actionData.filter.value || '{}')}));
        let data            =   {
            user_type: actionData.type,
            page: actionData.pageno,
            start:  actionData.start,
            end:actionData.end,
            value_one:  actionData.value_one,
            value_two:actionData.value_two,
            filter: actionData.filter
        }
        //console.log(actionData.storeName);
        let filtered        =   (['state', 'zone', 'store-id'].includes(data.value_one)) ? false : true;
        const payload = yield call(callApiV2, 'POST', url, data);

        // check for error
        if(payload.data.error){
            //notifyerror(payload.data.error);
            yield put(taskHistoryAction.listenHistoryError());
        }

        // handle success result
        if(payload.data.result){
            let result = payload.data.result;
            
            let tasks = {};
            //console.log('Length : ', result.tasks.length);
            if(actionData.value_one === 'store-id'){
                if(result.tasks.length > 0) {
                    let storeName    =   actionData.storeName;
                    result.tasks.map((val, key) => {
                        //console.log('Value : ', val);
                        let recipient_sig   =   false;                    
                        let track_driver    =   '';
                        let current_url     =   '';
                        //console.log(val, key)
                        let tskStatus = 'Scheduled';
                        if(val.tskStatus === 'tsk_proc_hld') {
                            tskStatus = 'Scheduled'
                        } else if(val.tskStatus === 'tsk_proc_mrchnt') {
                            tskStatus = 'Scheduled'
                        } else if(val.tskStatus === 'tsk_proc_drv' && val.driverStatus === 'drv_strt_recpnt_tsk') {
                            tskStatus = 'Picked Up';
                        } else if(val.tskStatus === 'tsk_proc_drv') {
                            tskStatus = 'Processing'
                        } else if(val.tskStatus === 'tsk_cmp') {
                            tskStatus = 'Completed'
                        } else if(val.tskStatus === 'tsk_cncling') {
                            tskStatus = 'Deleted'
                        } else if(val.tskStatus === 'tsk_cncled') {
                            tskStatus = 'Deleted'
                        }
                        let dt = val.timeCreated.split('T');
                        let d = dt[0].split('-');
                        let created_at = d[1]+'/'+d[2]+'/'+d[0]; 
                        
                        let completeafter = '';
                        let completebefore = '';
                        
                        if(val.timezone !== '') {
                        completeafter = getDateTime(parseInt(val.completeAfter) * 1000, val.timezone, 'MM/DD · hh:mma');
                        completebefore = getDateTime(parseInt(val.completeBefore) * 1000, val.timezone, 'hh:mma');
                        } else {
                        completeafter = getSysDateTime(parseInt(val.completeAfter) * 1000, 'MM/DD · hh:mma');
                        completebefore = getSysDateTime(parseInt(val.completeBefore) * 1000, 'hh:mma');
                        }
                        if(!_.isEmpty(val.completionDetails.events) && 
                            !!val.completionDetails.events.onflt_recpnt_sig) {
                            recipient_sig = true;
                        }
                        if(!_.isEmpty(val.completionDetails.events) && 
                            !!val.completionDetails.events.onflt_recpnt_sig) {
                            recipient_sig = true;
                        }

                        if(!!val.pickup_onfleet_url) {
                            track_driver        =   'Driver to Merchant';
                            current_url         =   val.pickup_onfleet_url;
                        }
                        
                        if(!!val.drop_onfleet_url) {
                            track_driver        =   'Driver to Recipient';
                            current_url         =   val.drop_onfleet_url;
                        }

                        if(!!!tasks[val.state_code]) {
                            tasks[val.state_code]   =   {};
                            tasks[val.state_code][val.store_id]   =   {
                                        name        :   storeName[val.store_id],
                                        id          :   val.state_code+val.store_id,
                                        orders      :   []
                            };
                        } else {
                            if(!!!tasks[val.state_code][val.store_id]) {
                                tasks[val.state_code][val.store_id]   =   {
                                    name        :   storeName[val.store_id],
                                    id          :   val.state_code+val.store_id,
                                    orders      :   []
                                };
                            }
                        }
                        
                        tasks[val.state_code][val.store_id].orders.push({
                            created_at              :   created_at,
                            timestamp               :   val.completeAfter,
                            complete_after          :   completeafter,
                            complete_before         :   completebefore,
                            recpnt_address          :   val.recipients.address,
                            mrchnt_address          :   val.merchant.address,
                            mrchnt_notes            :   val.merchant.notes,
                            recpnt_notes            :   val.recipients.notes,
                            tsk_status              :   tskStatus,
                            uuid                    :   val.uuid,
                            order_number            :   val.orderNumber,
                            driver_name             :   val.driver_name,
                            recipient_sig           :   recipient_sig,
                            timezone                :   val.timezone,
                            mrchnt_location         :   val.merchant.location,
                            recpnt_location         :   val.recipients.location,
                            drop_onfleet_url        :   val.drop_onfleet_url || '',
                            pickup_onfleet_url      :   val.pickup_onfleet_url || '',
                            track_driver            :   track_driver,
                            current_url             :   current_url,
                            tip                     :   val.tip,
                            state_code              :   val.state_code,
                            store_id                :   val.store_id,
                            mkt_ofc_cty_del_zne_id  :   val.mkt_ofc_cty_del_zne_id
                        });
                    });
                }
                let temp                        =   {};
                _.each(tasks, (val, key) => {
                    _.each(val, (vz, kz) => {
                        tasks[key][kz].orders   =   _.orderBy(tasks[key][kz].orders, [o => o.timestamp], ['desc'])
                    });
                    temp[key]                   =   _.sortBy(tasks[key], (o) => { return o.name; })
                });
                tasks                           =   temp;
            } else if(actionData.value_one === 'state'){                
                if(result.tasks.length > 0) {
                    result.tasks.map((val, key) => {
                        //console.log('Value : ', val);
                        let recipient_sig   =   false;                    
                        let track_driver    =   '';
                        let current_url     =   '';
                        //console.log(val, key)
                        let tskStatus = 'Scheduled';
                        if(val.tskStatus === 'tsk_proc_hld') {
                            tskStatus = 'Scheduled'
                        } else if(val.tskStatus === 'tsk_proc_mrchnt') {
                            tskStatus = 'Scheduled'
                        } else if(val.tskStatus === 'tsk_proc_drv' && val.driverStatus === 'drv_strt_recpnt_tsk') {
                            tskStatus = 'Picked Up';
                        } else if(val.tskStatus === 'tsk_proc_drv') {
                            tskStatus = 'Processing'
                        } else if(val.tskStatus === 'tsk_cmp') {
                            tskStatus = 'Completed'
                        } else if(val.tskStatus === 'tsk_cncling') {
                            tskStatus = 'Deleted'
                        } else if(val.tskStatus === 'tsk_cncled') {
                            tskStatus = 'Deleted'
                        }
                        let dt = val.timeCreated.split('T');
                        let d = dt[0].split('-');
                        let created_at = d[1]+'/'+d[2]+'/'+d[0]; 
                        
                        let completeafter = '';
                        let completebefore = '';
                        
                        if(val.timezone !== '') {
                        completeafter = getDateTime(parseInt(val.completeAfter) * 1000, val.timezone, 'MM/DD · hh:mma');
                        completebefore = getDateTime(parseInt(val.completeBefore) * 1000, val.timezone, 'hh:mma');
                        } else {
                        completeafter = getSysDateTime(parseInt(val.completeAfter) * 1000, 'MM/DD · hh:mma');
                        completebefore = getSysDateTime(parseInt(val.completeBefore) * 1000, 'hh:mma');
                        }
                        if(!_.isEmpty(val.completionDetails.events) && 
                            !!val.completionDetails.events.onflt_recpnt_sig) {
                            recipient_sig = true;
                        }
                        if(!_.isEmpty(val.completionDetails.events) && 
                            !!val.completionDetails.events.onflt_recpnt_sig) {
                            recipient_sig = true;
                        }

                        if(!!val.pickup_onfleet_url) {
                            track_driver        =   'Driver to Merchant';
                            current_url         =   val.pickup_onfleet_url;
                        }
                        
                        if(!!val.drop_onfleet_url) {
                            track_driver        =   'Driver to Recipient';
                            current_url         =   val.drop_onfleet_url;
                        }

                        /* if(!!!tasks[val.state_code]) {
                            tasks[val.state_code]   =   {};
                            tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]   =   {
                                        name        :   val.mkt_ofc_cty_del_zne_name,
                                        id          :   val.state_code+val.mkt_ofc_cty_del_zne_id,
                                        orders      :   []
                            };
                        } else {
                            if(!!!tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]) {
                                tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]   =   {
                                    name        :   val.mkt_ofc_cty_del_zne_name,
                                    id          :   val.state_code+val.mkt_ofc_cty_del_zne_id,
                                    orders      :   []
                                };
                            }
                        } */

                        if(!!!tasks[val.state_code]) {
                            tasks[val.state_code]   =   {
                                name        :   val.state_code,
                                orders      :   []
                            };
                        }

                        //console.log(tasks[val.state_code]);
                        
                        tasks[val.state_code].orders.push({
                            created_at              :   created_at,
                            timestamp               :   val.completeAfter,
                            complete_after          :   completeafter,
                            complete_before         :   completebefore,
                            recpnt_address          :   val.recipients.address,
                            mrchnt_address          :   val.merchant.address,
                            mrchnt_notes            :   val.merchant.notes,
                            recpnt_notes            :   val.recipients.notes,
                            tsk_status              :   tskStatus,
                            uuid                    :   val.uuid,
                            order_number            :   val.orderNumber,
                            driver_name             :   val.driver_name,
                            recipient_sig           :   recipient_sig,
                            timezone                :   val.timezone,
                            mrchnt_location         :   val.merchant.location,
                            recpnt_location         :   val.recipients.location,
                            drop_onfleet_url        :   val.drop_onfleet_url || '',
                            pickup_onfleet_url      :   val.pickup_onfleet_url || '',
                            track_driver            :   track_driver,
                            current_url             :   current_url,
                            tip                     :   val.tip,
                            state_code              :   val.state_code,
                            mkt_ofc_cty_del_zne_id  :   val.mkt_ofc_cty_del_zne_id
                        });
                    });
                }
                _.each(tasks, (val, key) => {
                    tasks[key].orders               =  _.orderBy(tasks[key].orders, [o => o.timestamp], ['desc']);
                });
            } else if(actionData.value_one === 'zone') {
                if(result.tasks.length > 0) {
                    result.tasks.map((val, key) => {
                        //console.log('Value : ', val);
                        let recipient_sig   =   false;                    
                        let track_driver    =   '';
                        let current_url     =   '';
                        //console.log(val, key)
                        let tskStatus = 'Scheduled';
                        if(val.tskStatus === 'tsk_proc_hld') {
                            tskStatus = 'Scheduled'
                        } else if(val.tskStatus === 'tsk_proc_mrchnt') {
                            tskStatus = 'Scheduled'
                        } else if(val.tskStatus === 'tsk_proc_drv' && val.driverStatus === 'drv_strt_recpnt_tsk') {
                            tskStatus = 'Picked Up';
                        } else if(val.tskStatus === 'tsk_proc_drv') {
                            tskStatus = 'Processing'
                        } else if(val.tskStatus === 'tsk_cmp') {
                            tskStatus = 'Completed'
                        } else if(val.tskStatus === 'tsk_cncling') {
                            tskStatus = 'Deleted'
                        } else if(val.tskStatus === 'tsk_cncled') {
                            tskStatus = 'Deleted'
                        }
                        let dt = val.timeCreated.split('T');
                        let d = dt[0].split('-');
                        let created_at = d[1]+'/'+d[2]+'/'+d[0]; 
                        
                        let completeafter = '';
                        let completebefore = '';
                        
                        if(val.timezone !== '') {
                        completeafter = getDateTime(parseInt(val.completeAfter) * 1000, val.timezone, 'MM/DD · hh:mma');
                        completebefore = getDateTime(parseInt(val.completeBefore) * 1000, val.timezone, 'hh:mma');
                        } else {
                        completeafter = getSysDateTime(parseInt(val.completeAfter) * 1000, 'MM/DD · hh:mma');
                        completebefore = getSysDateTime(parseInt(val.completeBefore) * 1000, 'hh:mma');
                        }
                        if(!_.isEmpty(val.completionDetails.events) && 
                            !!val.completionDetails.events.onflt_recpnt_sig) {
                            recipient_sig = true;
                        }
                        if(!_.isEmpty(val.completionDetails.events) && 
                            !!val.completionDetails.events.onflt_recpnt_sig) {
                            recipient_sig = true;
                        }

                        if(!!val.pickup_onfleet_url) {
                            track_driver        =   'Driver to Merchant';
                            current_url         =   val.pickup_onfleet_url;
                        }
                        
                        if(!!val.drop_onfleet_url) {
                            track_driver        =   'Driver to Recipient';
                            current_url         =   val.drop_onfleet_url;
                        }

                        if(!!!tasks[val.state_code]) {
                            tasks[val.state_code]   =   {};
                            tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]   =   {
                                        name        :   val.mkt_ofc_cty_del_zne_name,
                                        id          :   val.state_code+val.mkt_ofc_cty_del_zne_id,
                                        orders      :   []
                            };
                        } else {
                            if(!!!tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]) {
                                tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]   =   {
                                    name        :   val.mkt_ofc_cty_del_zne_name,
                                    id          :   val.state_code+val.mkt_ofc_cty_del_zne_id,
                                    orders      :   []
                                };
                            }
                        }
                        
                        tasks[val.state_code][val.mkt_ofc_cty_del_zne_id].orders.push({
                            created_at              :   created_at,
                            timestamp               :   val.completeAfter,
                            complete_after          :   completeafter,
                            complete_before         :   completebefore,
                            recpnt_address          :   val.recipients.address,
                            mrchnt_address          :   val.merchant.address,
                            mrchnt_notes            :   val.merchant.notes,
                            recpnt_notes            :   val.recipients.notes,
                            tsk_status              :   tskStatus,
                            uuid                    :   val.uuid,
                            order_number            :   val.orderNumber,
                            driver_name             :   val.driver_name,
                            recipient_sig           :   recipient_sig,
                            timezone                :   val.timezone,
                            mrchnt_location         :   val.merchant.location,
                            recpnt_location         :   val.recipients.location,
                            drop_onfleet_url        :   val.drop_onfleet_url || '',
                            pickup_onfleet_url      :   val.pickup_onfleet_url || '',
                            track_driver            :   track_driver,
                            current_url             :   current_url,
                            tip                     :   val.tip,
                            state_code              :   val.state_code,
                            mkt_ofc_cty_del_zne_id  :   val.mkt_ofc_cty_del_zne_id
                        });
                    });
                }
                let temp                        =   {};
                _.each(tasks, (val, key) => {
                    _.each(val, (vz, kz) => {
                        tasks[key][kz].orders   =   _.orderBy(tasks[key][kz].orders, [o => o.timestamp], ['desc'])
                    });
                    temp[key]                   =   _.sortBy(tasks[key], (o) => { return o.name; })
                });
                tasks                           =   temp;
            } else {
                tasks                           =   result.tasks || [];
                //tasks                           =   _.orderBy(tasks, [o => o.completeAfter], ['desc'])
            }
            //console.log('Saga : ', tasks)
            //notifysuccess({message:result.message});
            yield put(taskHistoryAction.listenHistorySuccess({tasks: tasks, task_count: result.task_count, list_type: actionData.value_one}));
        }
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
}

export function* exportTaskCsv(action){
    try {
        let actionData      =   action.data;
        let data            =   {
            user_type: actionData.type,
            page: actionData.pageno,
            start:  actionData.start,
            end:actionData.end,
            value_one:  actionData.value_one,
            value_two:actionData.value_two
        }
        const payload = yield call(callApiV2, 'POST', 'tasks/download', data);

        // check for error
        if(payload.data.error){
            yield put(taskHistoryAction.listenExportTaskCsvError());
        };

        if(payload.data.result){
            yield put(taskHistoryAction.listenExportTaskCsvSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* watchTaskHistoryStore() {
    try{
        //yield takeEvery( taskHistoryConstant.GET_HISTORY_FILTER, get_history_filter );
        yield takeEvery( taskHistoryConstant.GET_HISTORY, get_history );
        yield takeEvery( taskHistoryConstant.EXPORT_CSV_TASK_HISTORY, exportTaskCsv );
    } catch(e){
        console.log(e)
    }
}