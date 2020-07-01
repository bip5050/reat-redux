import * as reportAction from '../actions';
import * as headerAction from '../../Header/actions';
import * as reportConstant from '../constants';
import {callApiV2} from '../../../Helper/api';
import { takeEvery, put, call, all } from 'redux-saga/effects';
import {error as notifyerror, success as notifysuccess} from '../../../util/notify';
import {convertTwoDecimalRound, getDateTime, getSysDateTime, formatDate} from '../../../Helper/common';
import moment from 'moment-timezone';
import * as _ from 'lodash';

//Get Reports
export function* getReport(action){
    try {
        let data        =   {...action.data};
        delete data.show_by;
        let statsData       =   {...data};
        delete data.filter;
        delete action.data.filter;
        let reportData      =   {...action.data};
        if(reportData.show_by === 'month') {
            reportData.start       =   moment().subtract(12, 'months').format('YYYY-MM-DD');
            reportData.end         =   moment().format('YYYY-MM-DD');
        }
        yield put(headerAction.syncFilter({key: statsData.filter.key, value: JSON.parse(statsData.filter.value)}));
        const res = yield all([
            call(callApiV2, 'POST', 'reports/rerun', data),
            call(callApiV2, 'POST', 'reports/orders', reportData),
            call(callApiV2, 'POST', 'reports/stats-total', statsData)
        ]);

        if(res) {
            let rerun = res[0];
            let orders = res[1];
            let statsTotal = res[2];

            // check for error    
            if(rerun.data.error || rerun.data.error || rerun.data.error){
                yield put(reportAction.listenGetReportError());
            };

            if(rerun.data.result){
                let rerunData       =   rerun.data.result;
                rerunData.chng_rerun_total_percent  =   convertTwoDecimalRound(rerunData.chng_rerun_total_percent);

                let reportTotal     =   statsTotal.data.result;
                reportTotal.chng_shopping_late_percent  =   convertTwoDecimalRound(reportTotal.chng_shopping_late_percent);
                reportTotal.chng_tot_orders_percent  =   convertTwoDecimalRound(reportTotal.chng_tot_orders_percent);
                reportTotal.late_percentage  =   convertTwoDecimalRound(reportTotal.late_percentage);
                reportTotal.on_time_percentage  =   convertTwoDecimalRound(reportTotal.on_time_percentage);
                reportTotal.shopping_late_percent  =   convertTwoDecimalRound(reportTotal.shopping_late_percent);

                //console.log(rerunData, reportTotal);
                yield put(reportAction.listenGetReportSuccess({
                    rerunData: rerunData,
                    ordersData: orders.data.result,
                    reportTotal: reportTotal
                }));
            };
        } else {
            notifyerror({message: "Some error occured."}); 
        }
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};


//Get Daily/Store/Monthly Orders
export function* getOrder(action){
    let data                    =   {...action.data};
    if(data.show_by === 'month') {
        data.start       =   moment().subtract(12, 'months').format('YYYY-MM-DD');
        data.end         =   moment().format('YYYY-MM-DD');
    }
    try {
        const payload = yield call(callApiV2, 'POST', 'reports/orders', data);

        // check for error    
        if(payload.data.error){
            yield put(reportAction.listenGetOrderError());
        };

        if(payload.data.result){
            yield put(reportAction.listenGetOrderSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

//Get Late Orders
export function* getLateOrders(action){
    try {
        let data        =   {...action.data};
        delete data.filter;
        data.order_by   =   'complete_after';
        //console.log(data);
        //delete data.format;
        const payload = yield call(callApiV2, 'POST', `reports/late-orders`, data);

        // check for error
        if(payload.data.error){
            yield put(reportAction.listenLateOrders());
        };

        if(payload.data.result){
            //console.log(payload.data.result);
            //console.log('Length : ', result.tasks.length);
            let response    =   payload.data.result || {};
            //sortLateOrders(response, action, order_by, order, filterState, filterArea, filterStore, data);
            let sortData    =   {
                unsortedLateOrders    :   response.data,
                count       :   response.count,
                searchData  :   action.data,
            }
            yield put(reportAction.sortLateOrders(sortData));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

function* sortLateOrders(action) {   
    let data        =   action.data.searchData; 
    //console.log('Action Data : ', data);
    let filter      =   data.filter || {};
    let filterState =   filter.filterKeys.State || [];
    let filterArea  =   filter.filterKeys.Area || [];
    let filterStore =   filter.filterKeys.Store || [];
    let order_by    =   data.order_by || 'complete_after';
    let order       =   data.format || 'asc';
    let result      =   action.data.unsortedLateOrders;
    let tasks       =   {};
    let count       =   action.data.count || 0;
    let listType = '';
    if(data.type === 'store'){
        listType          =   'Zonewise';
        if(result.length > 0) {
            result.map((val, key) => {
                //count++;
                if(!!!tasks[val.state_code]) {
                    tasks[val.state_code]   =   {};
                    tasks[val.state_code][val.store_id]   =   {
                                name        :   val.store,
                                id          :   val.store_id,
                                orders      :   [],
                                a           :   0,
                                b           :   0,
                                c           :   0,
                                d           :   0,
                                total       :   0
                    };
                } else {
                    if(!!!tasks[val.state_code][val.store_id]) {
                        tasks[val.state_code][val.store_id]   =   {
                            name        :   val.store,
                            id          :   val.store_id,
                            orders      :   [],
                            a           :   0,
                            b           :   0,
                            c           :   0,
                            d           :   0,
                            total       :   0
                        };
                    }
                }

                tasks[val.state_code][val.store_id].total++;
                let lateClass       =   '';
                if(val.time_diff >= 0 && val.time_diff <= 20) {
                    lateClass       =   'ready';
                    tasks[val.state_code][val.store_id].b++;
                } else if(val.time_diff > 20 && val.time_diff <= 30) {
                    lateClass       =   'shopping';
                    tasks[val.state_code][val.store_id].c++;
                } else if(val.time_diff > 30) {
                    lateClass       =   'not_ready';
                    tasks[val.state_code][val.store_id].d++;
                } else {
                    tasks[val.state_code][val.store_id].a++;
                }
                
                tasks[val.state_code][val.store_id].orders.push({
                    timestamp               :   moment(val.created_at).format('X'),
                    created_at              :   formatDate(val.created_at),
                    cust_name               :   val.cust_name.toLowerCase(),
                    customer_name           :   val.cust_name,
                    order_number            :   val.order_number,
                    store                   :   val.store,
                    store_id                :   val.store_id,
                    complete_before         :   formatDate(val.complete_before),
                    complete_after          :   formatDate(val.complete_after),
                    delivery_time           :   formatDate(val.delivery_time),
                    driver_wait             :   val.driver_wait,
                    recpnt_task_start_time  :   formatDate(val.recpnt_task_start_time),
                    lateClass               :   lateClass,
                    time_diff               :   val.time_diff,
                    uuid                    :   val.uuid
                });
            });
        }
        let temp                        =   {};
        _.each(tasks, (val, key) => {
            _.each(val, (vz, kz) => {
                tasks[key][kz].orders   =   _.orderBy(tasks[key][kz].orders, [o => o[order_by]], [order]);
            });
            temp[key]                   =   _.sortBy(tasks[key], (o) => { return o.name; })
        });
        tasks                           =   temp;
    } else if(data.type === 'place'){
        if(filterState.length > 0 && filterArea.length === 0){ 
            listType         =   'Statewise'; 
            if(result.length > 0) {
                result.map((val, key) => {
                    //count++;
                    if(!!!tasks[val.state_code]) {
                        tasks[val.state_code]   =   {
                            name        :   val.state_code,
                            orders      :   [],
                            a           :   0,
                            b           :   0,
                            c           :   0,
                            d           :   0,
                            total       :   0
                        };
                    }

                    tasks[val.state_code].total++;
                    let lateClass       =   '';
                    if(val.time_diff >= 0 && val.time_diff <= 20) {
                        lateClass       =   'ready';
                        tasks[val.state_code].b++;
                    } else if(val.time_diff > 20 && val.time_diff <= 30) {
                        lateClass       =   'shopping';
                        tasks[val.state_code].c++;
                    } else if(val.time_diff > 30) {
                        lateClass       =   'not_ready';
                        tasks[val.state_code].d++;
                    } else {
                        tasks[val.state_code].a++;
                    }

                    //console.log(tasks[val.state_code]);
                    
                    tasks[val.state_code].orders.push({
                        timestamp               :   moment(val.created_at).format('X'),
                        created_at              :   formatDate(val.created_at),
                        cust_name               :   val.cust_name.toLowerCase(),
                        customer_name           :   val.cust_name,
                        order_number            :   val.order_number,
                        store                   :   val.store,
                        store_id                :   val.store_id,
                        complete_before         :   formatDate(val.complete_before),
                        complete_after          :   formatDate(val.complete_after),
                        delivery_time           :   formatDate(val.delivery_time),
                        driver_wait             :   val.driver_wait,
                        recpnt_task_start_time  :   formatDate(val.recpnt_task_start_time),
                        lateClass               :   lateClass,
                        time_diff               :   val.time_diff,
                        uuid                    :   val.uuid
                    });
                });
            }
            _.each(tasks, (val, key) => {
                tasks[key].orders               =  _.orderBy(tasks[key].orders, [o => o[order_by]], [order]);
            });
        } else if(filterArea.length > 0) {                    
            listType          =   'Zonewise';
            if(result.length > 0) {
                result.map((val, key) => {
                    //count++;
                    if(!!!tasks[val.state_code]) {
                        tasks[val.state_code]   =   {};
                        tasks[val.state_code][val.zone_id]   =   {
                                    name        :   val.zone_name,
                                    id          :   val.zone_id,
                                    orders      :   [],
                                    a           :   0,
                                    b           :   0,
                                    c           :   0,
                                    d           :   0,
                                    total       :   0
                        };
                    } else {
                        if(!!!tasks[val.state_code][val.zone_id]) {
                            tasks[val.state_code][val.zone_id]   =   {
                                name        :   val.zone_name,
                                id          :   val.zone_id,
                                orders      :   [],
                                a           :   0,
                                b           :   0,
                                c           :   0,
                                d           :   0,
                                total       :   0
                            };
                        }
                    }

                    let lateClass       =   '';
                    tasks[val.state_code][val.zone_id].total++;
                    if(val.time_diff >= 0 && val.time_diff <= 20) {
                        tasks[val.state_code][val.zone_id].b++;
                        lateClass       =   'ready';
                    } else if(val.time_diff > 20 && val.time_diff <= 30) {
                        tasks[val.state_code][val.zone_id].c++;
                        lateClass       =   'shopping';
                    } else if(val.time_diff > 30) {
                        tasks[val.state_code][val.zone_id].d++;
                        lateClass       =   'not_ready';
                    } else {
                        tasks[val.state_code][val.zone_id].a++;
                    }
                    
                    tasks[val.state_code][val.zone_id].orders.push({
                        timestamp               :   moment(val.created_at).format('X'),
                        created_at              :   formatDate(val.created_at),
                        cust_name               :   val.cust_name.toLowerCase(),
                        customer_name           :   val.cust_name,
                        order_number            :   val.order_number,
                        store                   :   val.store,
                        store_id                :   val.store_id,
                        complete_before         :   formatDate(val.complete_before),
                        complete_after          :   formatDate(val.complete_after),
                        delivery_time           :   formatDate(val.delivery_time),
                        driver_wait             :   val.driver_wait,
                        recpnt_task_start_time  :   formatDate(val.recpnt_task_start_time),
                        lateClass               :   lateClass,
                        time_diff               :   val.time_diff,
                        uuid                    :   val.uuid
                    });
                });
            }
            let temp                        =   {};
            _.each(tasks, (val, key) => {
                _.each(val, (vz, kz) => {
                    //tasks[key][kz].orders   =   _.orderBy(tasks[key][kz].orders, [o => o.timestamp], ['desc'])
                    tasks[key][kz].orders       =   _.orderBy(tasks[key][kz].orders, [o => o[order_by]], [order])
                });
                temp[key]                   =   _.sortBy(tasks[key], (o) => { return o.name; })
            });
            tasks                           =   temp;
        }
    } else {                
        tasks                   =   {
            a:0,
            b:0,
            c:0,
            d:0,
            total       :   0,
            orders: []
        }
        listType                =   'Uncategorized';
        result.map((val, key) => {   
            //count++;
            tasks.total++;
            let lateClass       =   '';
            if(val.time_diff >= 0 && val.time_diff <= 20) {
                tasks.b++;
                lateClass       =   'ready';
            } else if(val.time_diff > 20 && val.time_diff <= 30) {
                lateClass       =   'shopping';
                tasks.c++;
            } else if(val.time_diff > 30) {
                lateClass       =   'not_ready';
                tasks.d++;
            } else {
                tasks.a++;
            }
            //console.log(val.time_diff, moment(val.time_diff).format("mm:ss"))   
            tasks.orders.push({
                timestamp               :   moment(val.created_at).format('X'),
                created_at              :   formatDate(val.created_at),
                cust_name               :   val.cust_name.toLowerCase(),
                customer_name           :   val.cust_name,
                order_number            :   val.order_number,
                store                   :   val.store,
                store_id                :   val.store_id,
                complete_before         :   formatDate(val.complete_before),
                complete_after          :   formatDate(val.complete_after),
                delivery_time           :   formatDate(val.delivery_time),
                driver_wait             :   val.driver_wait,
                recpnt_task_start_time  :   formatDate(val.recpnt_task_start_time),
                lateClass               :   lateClass,
                time_diff               :   val.time_diff,
                uuid                    :   val.uuid
            });
        });
        //tasks                           =   result.tasks || [];
        tasks.orders                      =   _.orderBy(tasks.orders, [o => o[order_by]], [order])
    }
    //console.log('Saga : ', {count: count, tasks: tasks, listType: listType});
    yield put(reportAction.listenLateOrdersSuccess({unsortedLateOrders: result, arrangedTasks: { count: count, tasks: tasks, listType: listType, pageno: data.page, sortBy: order_by, format: order}}));
}

export function* watchReportStore() {
    try{
        yield takeEvery( reportConstant.GET_REPORT, getReport );
        yield takeEvery( reportConstant.GET_ORDER, getOrder );
        yield takeEvery( reportConstant.GET_LATE_ORDER, getLateOrders );
        yield takeEvery( reportConstant.SORT_LATE_ORDERS, sortLateOrders );
    } catch(e){
        console.log(e)
    }
};