import * as _ from 'lodash';
import { getDateTime } from '../Helper/common';

export function sortTaskList(snapshot, filter) {
    let filterState     =   filter.state || [];
    let filterArea      =   filter.area || [];
    let filterStore     =   filter.store || [];
    let filterStoreName =   filter.storeName || [];
    let filterTxt       =   (!!filter.searchTxt) ? filter.searchTxt.toLowerCase() : '';
    let tsk_status      =   '';
    let track_driver    =   '';
    let current_url     =   '';
    let created_at      =   '';
    let tasks                       =   {};
    let order_status                =   null;
    let tip                         =   0;
    let tsk_type                    =   'general';
    let task_count                  =   0;
    let type                        =   'UncategorizedList';
    if(!!snapshot) {
        if(filterState.length === 0 && filterArea.length === 0 && filterStore.length === 0) {
            type                        =   'UncategorizedList';
            tasks                       =   {
                ready           :   0,
                not_ready       :   0,
                total           :   0,
                shopping        :   0,
                orders          :   [],
                totShoppedLate  :   0
            }
            snapshot.forEach(function(doc) {
                let val                 =   doc.data();
                //console.log('Val : ', val.ready_timestamp, val.complete_after);
                task_count++;
                tsk_type                =   'general';
                tsk_status              =   '';
                track_driver            =   '';
                current_url             =   '';
                created_at              =   '';
                order_status            =   null;
                tip                     =   0;
                if(!_.isUndefined(val.tsk_type) && val.tsk_type !== '') {
                    tsk_type            =   val.tsk_type;
                }

                if(val.tsk_status === 'tsk_proc_hld') {
                    tsk_status          =   'Scheduled';
                } else if(val.tsk_status === 'tsk_proc_mrchnt') {
                    tsk_status          =   'Scheduled';
                } else if(val.tsk_status === 'tsk_proc_drv' && val.driver_status === 'drv_strt_recpnt_tsk') {
                    tsk_status          =   'Picked Up';
                } else if(val.tsk_status === 'tsk_proc_drv') {
                    tsk_status          =   'Processing';
                } else if(val.tsk_status === 'tsk_cmp') {
                    tsk_status          =   'Completed'
                } else if(val.tsk_status === 'tsk_cncling') {
                    tsk_status          =   'Deleted'
                } else if(val.tsk_status === 'tsk_cncled') {
                    tsk_status          =   'Deleted'
                } else {
                    tsk_status          =   'Scheduled'
                }

                if(!_.isUndefined(val.created_at) && val.created_at !== ''){
                    created_at          =   getDateTime(parseInt(val.created_at) * 1000, val.time_zone, 'MM/DD/YYYY');
                }

                if(!_.isUndefined(val.pickup_onfleet_url) && val.pickup_onfleet_url !== '') {
                    track_driver        =   'Driver to Merchant';
                    current_url         =   val.pickup_onfleet_url;
                }

                if(!_.isUndefined(val.drop_onfleet_url) && val.drop_onfleet_url !== '') {
                    track_driver        =   'Driver to Recipient';
                    current_url         =   val.drop_onfleet_url;
                }
                let coa                 =   getDateTime(parseInt(val.complete_after) * 1000, val.time_zone, 'MM/DD · hh:mma');
                let cob                 =   getDateTime(parseInt(val.complete_before) * 1000, val.time_zone, 'hh:mma');

                if(!!val.order_status) {
                    order_status            =   val.order_status;
                }

                tasks.total++;
                if(order_status === 'R' || order_status === 'F' || order_status === 'Y') {
                    tasks.ready++;
                } else if(order_status === 'W') {
                    tasks.shopping++;
                }
                else {
                    tasks.not_ready++;
                }

                if(!!val.tip) {
                    tip                     =   val.tip;
                }
                let shoppedLate             =   0;
                if(!!val.ready_timestamp && val.ready_timestamp > val.complete_after) {
                    shoppedLate             =   Math.round((val.ready_timestamp - val.complete_after)/60);
                }
                if(shoppedLate > 0)
                    tasks.totShoppedLate++;

                tasks.orders.push({
                    id                  :   val.id,
                    created_at          :   created_at,
                    complete_after      :   coa,
                    complete_before     :   cob,
                    recpnt_address      :   val.recpnt_address_full,
                    mrchnt_address      :   val.mrchnt_address_full,
                    driver_name         :   val.driver_name,
                    tsk_status          :   tsk_status,
                    uuid                :   val.uuid,
                    drop_onfleet_url    :   val.drop_onfleet_url || '',
                    pickup_onfleet_url  :   val.pickup_onfleet_url || '',
                    track_driver        :   track_driver,
                    current_url         :   current_url,
                    order_number        :   val.order_number,
                    timestamp           :   val.complete_after,
                    timezone            :   val.time_zone,
                    order_status        :   order_status,
                    mrchnt_name         :   val.mrchnt_name,
                    tsk_type            :   tsk_type,
                    shoppedLate         :   shoppedLate
                });
            });
            tasks.orders                   =   _.orderBy(tasks.orders, [o => o.timestamp], ['asc'])
        } else {
            if(filterState.length > 0 && filterArea.length === 0 && filterStore.length === 0) {
                type                        =   'StateWiseList';
                snapshot.forEach(function(doc) {
                    let val                 =   doc.data();
                    if((filterState.length === 0
                        || filterState.includes(val.state_code)) &&
                        (filterTxt === '' || val.order_number.toLowerCase().includes(filterTxt))
                        &&
                        (filterArea.length === 0 || filterArea.includes(val.mkt_ofc_cty_del_zne_name))
                        &&
                        (filterStore.length === 0 || filterStore.includes(val.store_id))
                    ) {
                        task_count++;
                        //console.log('Data : ', val);
                        tsk_type                =   'general';
                        tsk_status              =   '';
                        track_driver            =   '';
                        current_url             =   '';
                        created_at              =   '';
                        order_status            =   null;
                        tip                     =   0;
                        if(!_.isUndefined(val.tsk_type) && val.tsk_type !== '') {
                            tsk_type            =   val.tsk_type;
                        }

                        if(val.tsk_status === 'tsk_proc_hld') {
                            tsk_status          =   'Scheduled';
                        } else if(val.tsk_status === 'tsk_proc_mrchnt') {
                            tsk_status          =   'Scheduled';
                        } else if(val.tsk_status === 'tsk_proc_drv' && val.driver_status === 'drv_strt_recpnt_tsk') {
                            tsk_status          =   'Picked Up';
                        } else if(val.tsk_status === 'tsk_proc_drv') {
                            tsk_status          =   'Processing';
                        } else if(val.tsk_status === 'tsk_cmp') {
                            tsk_status          =   'Completed'
                        } else if(val.tsk_status === 'tsk_cncling') {
                            tsk_status          =   'Deleted'
                        } else if(val.tsk_status === 'tsk_cncled') {
                            tsk_status          =   'Deleted'
                        } else {
                            tsk_status          =   'Scheduled'
                        }

                        if(!_.isUndefined(val.created_at) && val.created_at !== ''){
                            created_at          =   getDateTime(parseInt(val.created_at) * 1000, val.time_zone, 'MM/DD/YYYY');
                        }

                        if(!_.isUndefined(val.pickup_onfleet_url) && val.pickup_onfleet_url !== '') {
                            track_driver        =   'Driver to Merchant';
                            current_url         =   val.pickup_onfleet_url;
                        }

                        if(!_.isUndefined(val.drop_onfleet_url) && val.drop_onfleet_url !== '') {
                            track_driver        =   'Driver to Recipient';
                            current_url         =   val.drop_onfleet_url;
                        }
                        let coa                 =   getDateTime(parseInt(val.complete_after) * 1000, val.time_zone, 'MM/DD · hh:mma');
                        let cob                 =   getDateTime(parseInt(val.complete_before) * 1000, val.time_zone, 'hh:mma');


                        if(!!!tasks[val.state_code]) {
                            tasks[val.state_code]   =   {
                                        name            :   val.state_code,
                                        ready           :   0,
                                        not_ready       :   0,
                                        shopping        :   0,
                                        total           :   0,
                                        orders          :   [],
                                        totShoppedLate  :   0
                            };
                        }

                        if(!!val.order_status) {
                            order_status            =   val.order_status;
                        }

                        tasks[val.state_code].total++;
                        if(order_status === 'R' || order_status === 'F' || order_status === 'Y') {
                            tasks[val.state_code].ready++;
                        } else if(order_status === 'W') {
                            tasks[val.state_code].shopping++;
                        }
                        else {
                            tasks[val.state_code].not_ready++;
                        }

                        if(!!val.tip) {
                            tip                     =   val.tip;
                        }
                        let shoppedLate             =   0;
                        //console.log('Status : ', val.order_number, val.ready_timestamp, val.complete_after, val.ready_timestamp > val.complete_after);
                        if(!!val.ready_timestamp && val.ready_timestamp > val.complete_after) {
                            shoppedLate             =   Math.round((val.ready_timestamp - val.complete_after)/60);
                        }
                        if(shoppedLate > 0)
                            tasks[val.state_code].totShoppedLate++;
                        tasks[val.state_code].orders.push({
                            id                  :   val.id,
                            created_at          :   created_at,
                            complete_after      :   coa,
                            complete_before     :   cob,
                            recpnt_address      :   val.recpnt_address_full,
                            mrchnt_address      :   val.mrchnt_address_full,
                            driver_name         :   val.driver_name,
                            tsk_status          :   tsk_status,
                            uuid                :   val.uuid,
                            drop_onfleet_url    :   val.drop_onfleet_url || '',
                            pickup_onfleet_url  :   val.pickup_onfleet_url || '',
                            track_driver        :   track_driver,
                            current_url         :   current_url,
                            order_number        :   val.order_number,
                            timestamp           :   val.complete_after,
                            timezone            :   val.time_zone,
                            order_status        :   order_status,
                            mrchnt_name         :   val.mrchnt_name,
                            tsk_type            :   tsk_type,
                            shoppedLate         :   shoppedLate
                        });
                    }
                });
                _.each(tasks, (val, key) => {
                    //console.log(val, key);
                    tasks[key].orders           =  _.orderBy(tasks[key].orders, [o => o.timestamp], ['asc']);
                });
                tasks                       =   _.orderBy(tasks, [o => o.name], ['asc']);
            }
            if(filterState.length > 0 && filterArea.length > 0 && filterStore.length === 0) {
                type                        =   'ZoneWiseList';
                snapshot.forEach(function(doc) {
                    let val                 =   doc.data();
                    if((filterState.length === 0
                        || filterState.includes(val.state_code)) &&
                        (filterTxt === '' || val.order_number.toLowerCase().includes(filterTxt))
                        &&
                        (filterArea.length === 0 || filterArea.includes(val.mkt_ofc_cty_del_zne_name))
                        &&
                        (filterStore.length === 0 || filterStore.includes(val.store_id))
                    ) {
                        task_count++;
                        //console.log('Data : ', val);
                        tsk_type                =   'general';
                        tsk_status              =   '';
                        track_driver            =   '';
                        current_url             =   '';
                        created_at              =   '';
                        order_status            =   null;
                        tip                     =   0;
                        if(!_.isUndefined(val.tsk_type) && val.tsk_type !== '') {
                            tsk_type            =   val.tsk_type;
                        }
                        //console.log('Status : ', val.tsk_status);

                        if(val.tsk_status === 'tsk_proc_hld') {
                            tsk_status          =   'Scheduled';
                        } else if(val.tsk_status === 'tsk_proc_mrchnt') {
                            tsk_status          =   'Scheduled';
                        } else if(val.tsk_status === 'tsk_proc_drv' && val.driver_status === 'drv_strt_recpnt_tsk') {
                            tsk_status          =   'Picked Up';
                        } else if(val.tsk_status === 'tsk_proc_drv') {
                            tsk_status          =   'Processing';
                        } else if(val.tsk_status === 'tsk_cmp') {
                            tsk_status          =   'Completed'
                        } else if(val.tsk_status === 'tsk_cncling') {
                            tsk_status          =   'Deleted'
                        } else if(val.tsk_status === 'tsk_cncled') {
                            tsk_status          =   'Deleted'
                        } else {
                            tsk_status          =   'Scheduled'
                        }

                        if(!_.isUndefined(val.created_at) && val.created_at !== ''){
                            created_at          =   getDateTime(parseInt(val.created_at) * 1000, val.time_zone, 'MM/DD/YYYY');
                        }

                        if(!_.isUndefined(val.pickup_onfleet_url) && val.pickup_onfleet_url !== '') {
                            track_driver        =   'Driver to Merchant';
                            current_url         =   val.pickup_onfleet_url;
                        }

                        if(!_.isUndefined(val.drop_onfleet_url) && val.drop_onfleet_url !== '') {
                            track_driver        =   'Driver to Recipient';
                            current_url         =   val.drop_onfleet_url;
                        }
                        let coa                 =   getDateTime(parseInt(val.complete_after) * 1000, val.time_zone, 'MM/DD · hh:mma');
                        let cob                 =   getDateTime(parseInt(val.complete_before) * 1000, val.time_zone, 'hh:mma');


                        if(_.isUndefined(tasks[val.state_code])) {
                            tasks[val.state_code]   =   {};
                            tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]   =   {
                                        name            :   val.mkt_ofc_cty_del_zne_name,
                                        id              :   val.state_code+val.mkt_ofc_cty_del_zne_id,
                                        uniqueid        :   val.mkt_ofc_cty_del_zne_id,
                                        ready           :   0,
                                        not_ready       :   0,
                                        shopping        :   0,
                                        total           :   0,
                                        orders          :   [],
                                        totShoppedLate  :   0
                            };
                        } else {
                            if(_.isUndefined(tasks[val.state_code][val.mkt_ofc_cty_del_zne_id])) {
                                tasks[val.state_code][val.mkt_ofc_cty_del_zne_id]   =   {
                                    name            :   val.mkt_ofc_cty_del_zne_name,
                                    id              :   val.state_code+val.mkt_ofc_cty_del_zne_id,
                                    uniqueid        :   val.mkt_ofc_cty_del_zne_id,
                                    ready           :   0,
                                    not_ready       :   0,
                                    shopping        :   0,
                                    total           :   0,
                                    orders          :   [],
                                    totShoppedLate  :   0
                                };
                            }
                        }

                        if(!!val.order_status) {
                            order_status            =   val.order_status;
                        }

                        tasks[val.state_code][val.mkt_ofc_cty_del_zne_id].total++;
                        if(order_status === 'R' || order_status === 'F' || order_status === 'Y') {
                            tasks[val.state_code][val.mkt_ofc_cty_del_zne_id].ready++;
                        } else if(order_status === 'W') {
                            tasks[val.state_code][val.mkt_ofc_cty_del_zne_id].shopping++;
                        }
                        else {
                            tasks[val.state_code][val.mkt_ofc_cty_del_zne_id].not_ready++;
                        }

                        if(!!val.tip) {
                            tip                     =   val.tip;
                        }
                        
                        let shoppedLate             =   0;
                        if(!!val.ready_timestamp && val.ready_timestamp > val.complete_after) {
                            shoppedLate             =   Math.round((val.ready_timestamp - val.complete_after)/60);
                        }
                        if(shoppedLate > 0)
                            tasks[val.state_code][val.mkt_ofc_cty_del_zne_id].totShoppedLate++;

                        tasks[val.state_code][val.mkt_ofc_cty_del_zne_id].orders.push({
                            id                  :   val.id,
                            created_at          :   created_at,
                            complete_after      :   coa,
                            complete_before     :   cob,
                            recpnt_address      :   val.recpnt_address_full,
                            mrchnt_address      :   val.mrchnt_address_full,
                            driver_name         :   val.driver_name,
                            tsk_status          :   tsk_status,
                            uuid                :   val.uuid,
                            drop_onfleet_url    :   val.drop_onfleet_url || '',
                            pickup_onfleet_url  :   val.pickup_onfleet_url || '',
                            track_driver        :   track_driver,
                            current_url         :   current_url,
                            order_number        :   val.order_number,
                            timestamp           :   val.complete_after,
                            timezone            :   val.time_zone,
                            order_status        :   order_status,
                            mrchnt_name         :   val.mrchnt_name,
                            tsk_type            :   tsk_type,
                            shoppedLate         :   shoppedLate
                        });
                    }
                });
                let temp                        =   {};
                _.each(tasks, (val, key) => {
                    _.each(val, (vz, kz) => {
                        tasks[key][kz].orders   =   _.sortBy(tasks[key][kz].orders, (o) => { return o.timestamp; })
                    });
                    temp[key]                   =   _.sortBy(tasks[key], (o) => { return o.name; })
                });
                tasks                           =   temp;
            }
            if(filterStore.length > 0) {
                type                        =   'ZoneWiseList';
                snapshot.forEach(function(doc) {
                    let val                 =   doc.data();
                    if((filterState.length === 0
                        || filterState.includes(val.state_code)) &&
                        (filterTxt === '' || val.order_number.toLowerCase().includes(filterTxt))
                        &&
                        (filterArea.length === 0 || filterArea.includes(val.mkt_ofc_cty_del_zne_name))
                        &&
                        (filterStore.length === 0 || filterStore.includes(val.store_id))
                    ) {
                        task_count++;
                        //console.log('Data : ', val);
                        tsk_type                =   'general';
                        tsk_status              =   '';
                        track_driver            =   '';
                        current_url             =   '';
                        created_at              =   '';
                        order_status            =   null;
                        tip                     =   0;
                        if(!_.isUndefined(val.tsk_type) && val.tsk_type !== '') {
                            tsk_type            =   val.tsk_type;
                        }
                        //console.log('Status : ', val.tsk_status);

                        if(val.tsk_status === 'tsk_proc_hld') {
                            tsk_status          =   'Scheduled';
                        } else if(val.tsk_status === 'tsk_proc_mrchnt') {
                            tsk_status          =   'Scheduled';
                        } else if(val.tsk_status === 'tsk_proc_drv' && val.driver_status === 'drv_strt_recpnt_tsk') {
                            tsk_status          =   'Picked Up';
                        } else if(val.tsk_status === 'tsk_proc_drv') {
                            tsk_status          =   'Processing';
                        } else if(val.tsk_status === 'tsk_cmp') {
                            tsk_status          =   'Completed'
                        } else if(val.tsk_status === 'tsk_cncling') {
                            tsk_status          =   'Deleted'
                        } else if(val.tsk_status === 'tsk_cncled') {
                            tsk_status          =   'Deleted'
                        } else {
                            tsk_status          =   'Scheduled'
                        }

                        if(!_.isUndefined(val.created_at) && val.created_at !== ''){
                            created_at          =   getDateTime(parseInt(val.created_at) * 1000, val.time_zone, 'MM/DD/YYYY');
                        }

                        if(!_.isUndefined(val.pickup_onfleet_url) && val.pickup_onfleet_url !== '') {
                            track_driver        =   'Driver to Merchant';
                            current_url         =   val.pickup_onfleet_url;
                        }

                        if(!_.isUndefined(val.drop_onfleet_url) && val.drop_onfleet_url !== '') {
                            track_driver        =   'Driver to Recipient';
                            current_url         =   val.drop_onfleet_url;
                        }
                        let coa                 =   getDateTime(parseInt(val.complete_after) * 1000, val.time_zone, 'MM/DD · hh:mma');
                        let cob                 =   getDateTime(parseInt(val.complete_before) * 1000, val.time_zone, 'hh:mma');


                        if(_.isUndefined(tasks[val.state_code])) {
                            tasks[val.state_code]   =   {};
                            tasks[val.state_code][val.store_id]   =   {
                                        name            :   filterStoreName[val.store_id],
                                        id              :   val.state_code+val.store_id,
                                        uniqueid        :   val.store_id,
                                        ready           :   0,
                                        not_ready       :   0,
                                        shopping        :   0,
                                        total           :   0,
                                        orders          :   [],
                                        totShoppedLate  :   0
                            };
                        } else {
                            if(_.isUndefined(tasks[val.state_code][val.store_id])) {
                                tasks[val.state_code][val.store_id]   =   {
                                    name            :   filterStoreName[val.store_id],
                                    id              :   val.state_code+val.store_id,
                                    uniqueid        :   val.store_id,
                                    ready           :   0,
                                    not_ready       :   0,
                                    shopping        :   0,
                                    total           :   0,
                                    orders          :   [],
                                    totShoppedLate  :   0
                                };
                            }
                        }

                        if(!!val.order_status) {
                            order_status            =   val.order_status;
                        }

                        tasks[val.state_code][val.store_id].total++;
                        if(order_status === 'R' || order_status === 'F' || order_status === 'Y') {
                            tasks[val.state_code][val.store_id].ready++;
                        } else if(order_status === 'W') {
                            tasks[val.state_code][val.store_id].shopping++;
                        }
                        else {
                            tasks[val.state_code][val.store_id].not_ready++;
                        }

                        if(!!val.tip) {
                            tip                     =   val.tip;
                        }
                        let shoppedLate             =   0;
                        if(!!val.ready_timestamp && val.ready_timestamp > val.complete_after) {
                            shoppedLate             =   Math.round((val.ready_timestamp - val.complete_after)/60);
                        }
                        if(shoppedLate > 0)
                            tasks[val.state_code][val.store_id].totShoppedLate++;

                        tasks[val.state_code][val.store_id].orders.push({
                            id                  :   val.id,
                            created_at          :   created_at,
                            complete_after      :   coa,
                            complete_before     :   cob,
                            recpnt_address      :   val.recpnt_address_full,
                            mrchnt_address      :   val.mrchnt_address_full,
                            driver_name         :   val.driver_name,
                            tsk_status          :   tsk_status,
                            uuid                :   val.uuid,
                            drop_onfleet_url    :   val.drop_onfleet_url || '',
                            pickup_onfleet_url  :   val.pickup_onfleet_url || '',
                            track_driver        :   track_driver,
                            current_url         :   current_url,
                            order_number        :   val.order_number,
                            timestamp           :   val.complete_after,
                            timezone            :   val.time_zone,
                            order_status        :   order_status,
                            mrchnt_name         :   val.mrchnt_name,
                            tsk_type            :   tsk_type,
                            shoppedLate         :   shoppedLate
                        });
                    }
                });
                let temp                        =   {};
                _.each(tasks, (val, key) => {
                    _.each(val, (vz, kz) => {
                        tasks[key][kz].orders   =   _.sortBy(tasks[key][kz].orders, (o) => { return o.timestamp; })
                    });
                    temp[key]                   =   _.sortBy(tasks[key], (o) => { return o.name; })
                });
                tasks                           =   temp;
            }
        }
    }
    return {tasks: tasks, count: task_count, type: type};
}


export const addressFormater = (obj) => {
    try{
      let regex = /(\d+) (.+?), (.+?), (.+?) ([0-9]{5})/;
  
      let address = obj.match(regex);
      //console.log(address);
      if(address[4].indexOf(',') > -1 && address[3].indexOf(' ') > -1){
        let formattedAddress = address[3]+', '+ address[4] + ' '+ address[address.length -1];
        let modAddress = formattedAddress+', USA';
        if(/(\d+) (.+?), (.+?), (.+?) ([0-9]{5})/g.test(modAddress)){
          let _address = modAddress.match(regex);
  
          return {
            validAdrs: true, 
            formattedAddress: formattedAddress,
            address: modAddress,
            number: _address[0],
            street: _address[1],
            city: _address[2],
            country: 'United States',
            state_code: _address[4],
            zipcode: _address[_address.length -1]
          }
        } else {
          return {
            validAdrs: false 
          }
        }
      } else {
        let formattedAddress = address[1] + ' ' + address[2] + ', '+ address[3] + ', ' + address[4] + ' ' + address[address.length -1];
        return {
          validAdrs: true, 
          formattedAddress: formattedAddress,
          address: obj,
          number: address[1],
          street: address[2],
          city: address[3],
          country: 'United States',
          state_code: address[4],
          zipcode: address[address.length -1],
        }
      }
    } catch(e){
      console.log(e);
      return {
        validAdrs: false 
      }
    }
};



export function getStatusClass(status){
    let clsName         =  '';
    switch(status) {
        case'Processing':
            clsName     =  'btn_Processing';
        break;
        case'Picked Up':
            clsName     =  'btn_Pickedup';
        break;
        case'Scheduled':
            clsName     =  'btn_Scheduled';
        break;
        case'Completed':
            clsName     =  'btn_Completed';
        break;
        case'Deleted':
            clsName     =  'btn_Deleted';
        break;
        default:
            clsName     =  'btn_Processing';
        break;
    }
    return clsName;
}

export function getTaskStatus(status) {
    let tsk_status          =   'Scheduled';
    if(status === 'tsk_proc_hld') {
        tsk_status          =   'Scheduled';
    } else if(status === 'tsk_proc_mrchnt') {
        tsk_status          =   'Scheduled';
    } else if(status === 'tsk_proc_drv' && status === 'drv_strt_recpnt_tsk') {
        tsk_status          =   'Picked Up';
    } else if(status === 'tsk_proc_drv') {
        tsk_status          =   'Processing';
    } else if(status === 'tsk_cmp') {
        tsk_status          =   'Completed';
    } else if(status === 'tsk_cncling') {
        tsk_status          =   'Deleted';
    } else if(status === 'tsk_cncled') {
        tsk_status          =   'Deleted';
    } else {
        tsk_status          =   'Scheduled';
    }
    return tsk_status;
}

export function getDeliveryWindow(completeAfter, completeBefore, time_zone){
    let coa     =   getDateTime(parseInt(completeAfter) * 1000, time_zone, 'MM/DD · hh:mma');
    let cob     =   getDateTime(parseInt(completeBefore) * 1000, time_zone, 'hh:mma');
    return `${coa} - ${cob}`;
}