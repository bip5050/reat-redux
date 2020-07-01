import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as dashboardConstant from '../constants';
import {error as notifyerror, success as notifysuccess} from '../../../util/notify';
import * as dashboardAction from '../actions';
import * as headerAction from '../../Header/actions';
import {callApi, callApiV2, callOnFleetApi} from '../../../Helper/api';
import moment from 'moment-timezone';
import * as _ from 'lodash';
import {isEmpty, compact} from 'lodash';
import { getDateTime, getSysDateTime, getFilter } from '../../../Helper/common';


//Get Locations & Zones
export function* getLocations(action){
    try {
        let url                 =   '';
        let statesLocalStorage  =   JSON.parse(localStorage.getItem('states') || '[]');
        let states              =   statesLocalStorage.map(item => item.id);
        url                     =   `location/all`;
        const res   =   yield all([
                                        call(callApi, 'GET', url),
                                        call(callApiV2, 'POST', 'location/zones', {"state":states})
                                    ]);

        
        if(res) {
            let payload     =   res[0];
            let zone        =   res[1];

            // check for error    
            if(payload.data.error){
                yield put(dashboardAction.listenGetLocationsError());
            }
    
            // handle success result
            if(payload.data.result){
                let zoneList    =   {};
                let taskType    =   '';
                let pharmacy    =   false;
                let locations   =   [];
                let stores      =   [];
                let result      =   payload.data.result;
                let user        =   payload.data.user;
                if(user.user_type === 'pharmacy') {
                    taskType    =   "pharmacy";
                    pharmacy    =   true;
                } else if(user.user_type === 'general'){
                    taskType    =   "general";
                    pharmacy    =   false;
                } else { 
                    taskType    =   "admin";
                    pharmacy    =   false;
                }
                result.map((v, k) => {
                    locations[k] = {
                        id      :   v.id,
                        value   :   k,
                        label   :   v.address,
                        data    :   v
                    };	
                    if(v.store !== '' && v.store !== null) {
                        stores[k] = {
                            id      :   v.id,
                            zone_id :   v.zone_id,
                            value   :   k,
                            label   :   v.store,
                            data    :   v
                        };
                    }
                });
                stores          =   compact(stores);
                locations       =   compact(locations);

                if(!!zone.data) {
                    zoneList            =   zone.data || {};
                }

                yield put(dashboardAction.listenGetLocationsSuccess({
                    taskType: taskType,
                    pharmacy: pharmacy,
                    locations: locations,
                    stores: stores,
                    zones: zoneList
                }));
            }
        }
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
}


//Get Locations & Zones
export function* getTaskDetails(action){
    try {
        let url                 =   '';
        url                     =   `tasks/${action.data.uuid}`;
        const payload               =   yield call(callApiV2, 'GET', url);       

        // check for error    
        if(payload.data.error){
            yield put(dashboardAction.listenGetTaskDetailsError());
        }

        // handle success result
        if(payload.data){ 
            yield put(dashboardAction.listenGetTaskDetailsSuccess(payload.data));
        }
    } catch (e) {
        notifyerror(e.message);
        console.log(e.message);
    }
}

//Get Track Details
export function* getTrackDetails(action){
    try {
        let url                 =   '';
        url                     =   `tasks/${action.data.uuid}`;
        const payload               =   yield call(callOnFleetApi, 'GET', url);       

        // check for error    
        if(payload.data.error){
            //yield put(dashboardAction.listenGetTaskDetailsError());
        }

        // handle success result
        if(payload.data){
            //yield put(dashboardAction.listenGetTaskDetailsSuccess(payload.data));
        }
    } catch (e) {
        notifyerror(e.message);
        console.log(e.message);
    }
}

//Create Task
export function* createTask(action){
    try {
        let url             =   '';
        url                 =   `tasks`;
        const payload       =   yield call(callApi, 'POST', url, action.data);

        // check for error
        if(payload.data.error){
            console.log(payload.data.error);
            yield put(dashboardAction.listenCreateTaskError());
        }

        // handle success result
        if(payload.data){           
            notifysuccess({message: 'Task has been created successfully'});    
            yield put(dashboardAction.listenCreateTaskSuccess({}));
        }
    } catch (e) {
        notifyerror(e.message);
        console.log(e.message);
    }
}

//Delete Task
export function* deleteTask(action){
    try {
        let url             =   '';
        url                 =   `tasks/${action.data.uuid}`;
        let data            =   {"timestamp":moment().format('X')}
        const payload       =   yield call(callApi, 'DELETE', url, data);  

        // check for error
        if(payload.data.error){
            yield put(dashboardAction.listenDeleteTaskError());
        }

        // handle success result
        if(payload.data){           
            notifysuccess({message: 'Task deleted successfully'});
            yield put(dashboardAction.listenDeleteTaskSuccess({}));
        }
    } catch (e) {
        notifyerror(e.message);
        console.log(e.message);
    }
}

//Update Task Status
export function* updateTaskStatus(action){
    try {
        let url             =   '';
        url                 =   `tasks/status/${action.data.uuid}`;
        let data            =   {orderStatus:{status:action.data.status}};
        const payload       =   yield call(callApi, 'PUT', url, data);  

        // check for error
        if(payload.data.error){
            yield put(dashboardAction.listenUpdateTaskStatusError());
        }

        // handle success result
        if(payload.data){
            notifysuccess({message: 'Task status updated successfully'});           
            yield put(dashboardAction.listenUpdateTaskStatusSuccess({}));
        }
    } catch (e) {
        notifyerror(e.message);
        console.log(e.message);
    }
}

//Edit Task
export function* editTask(action){
    try {
        let url             =   '';
        url                 =   `tasks/${action.data.uuid}`;
        let data            =   {...action.data.params};
        const payload       =   yield call(callApi, 'PUT', url, data);  

        // check for error
        if(payload.data.error){
            yield put(dashboardAction.listenEditTaskError());
        }

        // handle success result
        if(payload.data){
            //console.log('Success : ', payload.data);
            notifysuccess({message: 'Task updated successfully'});           
            yield put(dashboardAction.listenEditTaskSuccess({}));
        }
    } catch (e) {
        //console.log('Catch : ', e, e.response, e.response.data, e.message.cause);
        if(e.response && !!e.response.data) {
            notifyerror({message: e.response.data.message.cause});
        } else {
            notifyerror({message: e.message});
        }
        console.log(e.message);
    }
}

//Get Search
export function* search(action){
    try {
        let url                 =   '';
        url                     =   `tasks/search`;
        let data                =   {
            userType    :   action.data.user_type,
            valueOne    :   action.data.type,
            valueTwo    :   action.data.value
        }
        if(!!action.data.dateType) {
            data.dateType        =   action.data.dateType;
        }
        const payload            =   yield call(callApiV2, 'POST', url, data);

        // check for error    
        if(payload.data.error){
            yield put(dashboardAction.listenSearchError());
        }

        // handle success result
        if(payload.data.result){
            let result = payload.data.result;
            let tasks = {};
            if(result.tasks.length > 0) {
                result.tasks.map((val, key) => {
                    let recipient_sig   =   false;                    
                    let track_driver    =   '';
                    let current_url     =   '';
                    let tskStatus       =   'Scheduled';
                    if(val.tskStatus === 'tsk_proc_hld') {
                        tskStatus       =   'Scheduled'
                    } else if(val.tskStatus === 'tsk_proc_mrchnt') {
                        tskStatus       =   'Scheduled'
                    } else if(val.tskStatus === 'tsk_proc_drv' && val.driverStatus === 'drv_strt_recpnt_tsk') {
                        tskStatus       =   'Picked Up';
                    } else if(val.tskStatus === 'tsk_proc_drv') {
                        tskStatus       =   'Processing'
                    } else if(val.tskStatus === 'tsk_cmp') {
                        tskStatus       =   'Completed'
                    } else if(val.tskStatus === 'tsk_cncling') {
                        tskStatus       =   'Deleted'
                    } else if(val.tskStatus === 'tsk_cncled') {
                        tskStatus       =   'Deleted'
                    }
                    let dt              =   val.timeCreated.split('T');
                    let d               =   dt[0].split('-');
                    let created_at      =   d[1]+'/'+d[2]+'/'+d[0]; 
                    
                    let completeafter   =   '';
                    let completebefore  =   '';
                    
                    if(val.timezone !== '') {
                        completeafter   =   getDateTime(parseInt(val.completeAfter) * 1000, val.timezone, 'MM/DD · hh:mma');
                        completebefore  =   getDateTime(parseInt(val.completeBefore) * 1000, val.timezone, 'hh:mma');
                    } else {
                    completeafter       =   getSysDateTime(parseInt(val.completeAfter) * 1000, 'MM/DD · hh:mma');
                    completebefore      =   getSysDateTime(parseInt(val.completeBefore) * 1000, 'hh:mma');
                    }
                    if(!isEmpty(val.completionDetails.events) && 
                        !!val.completionDetails.events.onflt_recpnt_sig) {
                        recipient_sig   =   true;
                    }
                    if(!isEmpty(val.completionDetails.events) && 
                        !!val.completionDetails.events.onflt_recpnt_sig) {
                        recipient_sig   =   true;
                    }

                    if(!!val.pickup_onfleet_url) {
                        track_driver    =   'Driver to Merchant';
                        current_url     =   val.pickup_onfleet_url;
                    }
                    
                    if(!!val.drop_onfleet_url) {
                        track_driver    =   'Driver to Recipient';
                        current_url     =   val.drop_onfleet_url;
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
                    tasks[key][kz].orders   =   _.sortBy(tasks[key][kz].orders, (o) => { return o.timestamp; })
                });
                temp[key]                   =   _.sortBy(tasks[key], (o) => { return o.name; })
            });
            tasks                           =   temp;
            yield put(dashboardAction.listenSearchSuccess({count: result.tasks.length, tasks: tasks}));
        }
    } catch (e) {
        notifyerror(e.message);
        console.log(e.message);
    }
}

//Update filter
export function* updateFilter(action){
    try {
        let url                 =   '';
        url                     =   `tasks/filter`;
        let data                =   {
            filter: {
                key : 'dashboard',
                value : JSON.stringify(action.data)
            }
        }
        yield put(headerAction.syncFilter({
            key : 'dashboard',
            value : action.data
        }));
        const payload            =   yield call(callApiV2, 'POST', url, data);

        // check for error    
        if(payload.data.error){
            //yield put(dashboardAction.listenSearchError());
        }

        // handle success result
        if(payload.data){
            //console.log('Filtered Saved')
            let filterData      =  action.data || {};
            let filterKeys      =  filterData.filterKeys || {};
            let data            =	{
                user_type		:	filterData.type,
                type            :   'default'
            }
            if(!isEmpty(filterKeys)) {   
                if(filterKeys.Store.length === 0 && filterKeys.Area.length === 0 && filterKeys.State.length > 0) {
                    let states           =  (filterKeys.State || []).map(item => {
                    //return {state: item.value, zone_id: []};
                    return item.value;
                    });
                    if(states.length > 0){
                        data			=	{
                            type		:	'state',
                            state		:	states
                        }
                    //value_one         =  'state';
                    //value_two         =  states;
                    }
                }
        
                if(filterKeys.Store.length === 0 && filterKeys.Area.length > 0) {         
                    let zones           =  [];
                    (filterKeys.Area || []).map((item) => {
                    let index		=	zones.findIndex((z) => z.state === item.state);
                    //console.log(filterKeys.Area, index);
                    if(index > -1){
                        zones[index].zone_id.push(item.id)
                    } else {
                        zones.push({
                            state: item.state,
                            zone_id : [item.id]
                        })
                    }
                    });

                    if(zones.length > 0){
                    data			=	{
                        type		:	'place',
                        place		:	zones
                    }
                    //type         		=  'place';
                    //place         	=  zones; 
                    
                    }
                }
        
                if(filterKeys.Store.length > 0) {
                    let store            =  [];
                    (filterKeys.Store || []).forEach(item => {
                    store.push(item.store_id.toString());
                    })
                    if(store.length > 0){
                    data			=	{
                        type		:	'store',
                        store_id	:	store
                    }
                    //type         		=  'store';
                    //store_id         	=  store;
                    }
                }
                data.user_type		=	filterData.type;
                if(!!!data.type) {
                    data.type      =  'default';
                }
            }
            yield put(dashboardAction.getShoppedLate(data));
        }
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
}



//Get Search
export function* getShoppedLate(action){
    try {
        let url                 =   '';
        url                     =   `tasks/summary`;
        const payload            =   yield call(callApiV2, 'POST', url, action.data);

        // check for error    
        if(payload.data.error){
            yield put(dashboardAction.listenShoppedLateError());
        }

        // handle success result
        if(payload.data.result){
            let result                  =   payload.data.result || [];
            let shoppedLateSummary      =   {};
            if(result.length > 0) {
                if(action.data.type === 'default') {
                    shoppedLateSummary      =   {...result[0]};
                }
                if(action.data.type === 'state') {
                    let states          =   {};
                    result.map(item => {
                        states[item.state_code]     =   {
                            shopped_late:   item.shopped_late,
                            shopping_late_percent: item.shopping_late_percent,
                            total_orders: item.total_orders
                        }
                    })
                    shoppedLateSummary      =   {...states};
                }
                if(action.data.type === 'place') {
                    let zones          =   {};
                    result.map(item => {
                        if(!!zones[item.state_code]) {                            
                            zones[item.state_code][item.mkt_ofc_cty_del_zne_id]     =   {
                                shopped_late:   item.shopped_late,
                                shopping_late_percent: item.shopping_late_percent,
                                total_orders: item.total_orders
                            }
                        } else {
                            zones[item.state_code]   =   {};
                            zones[item.state_code][item.mkt_ofc_cty_del_zne_id]     =   {
                                shopped_late:   item.shopped_late,
                                shopping_late_percent: item.shopping_late_percent,
                                total_orders: item.total_orders
                            }
                        }
                    })
                    shoppedLateSummary      =   {...zones};
                }
                if(action.data.type === 'store') {
                    let store          =   {};
                    result.map(item => {
                        store[item.store_id]     =   {
                            shopped_late:   item.shopped_late,
                            shopping_late_percent: item.shopping_late_percent,
                            total_orders: item.total_orders
                        }
                    })
                    shoppedLateSummary      =   {...store};
                }
            }
            //console.log(shoppedLateSummary);
            yield put(dashboardAction.listenShoppedLateSuccess({summary: {...shoppedLateSummary}, type: action.data.type}));
        }
    } catch (e) {
        notifyerror(e.message);
        console.log(e.message);
    }
}

export function* watchDashboardStore() {
    try{
        yield takeEvery( dashboardConstant.GET_TRACK_DETAILS, getTrackDetails );
        yield takeEvery( dashboardConstant.GET_TASK_DETAILS, getTaskDetails );
        yield takeEvery( dashboardConstant.GET_LOCATIONS, getLocations );
        yield takeEvery( dashboardConstant.DELETE_TASK, deleteTask );
        yield takeEvery( dashboardConstant.UPDATE_TASK_STATUS, updateTaskStatus );
        yield takeEvery( dashboardConstant.CREATE_TASK, createTask );
        yield takeEvery( dashboardConstant.EDIT_TASK, editTask );
        yield takeEvery( dashboardConstant.TASK_SEARCH, search );
        yield takeEvery( dashboardConstant.UPDATE_FILTER, updateFilter );
        yield takeEvery( dashboardConstant.GET_SHOPPEDLATE, getShoppedLate );
    } catch(e){
        console.log(e)
    }
}