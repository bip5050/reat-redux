import React, { Component } from 'react';
import { fb as firebase, database as firebaseDb } from '../../util/firebase';
import { sortTaskList } from '../../util/helper';
import { Link } from 'react-router-dom';
import { isEmpty, isEqual, map as _map } from 'lodash';
import CustomContext from '../Modals/contextMenu';
import EditTask from '../Modals/editTaskModal';
import TaskDetails from '../Modals/taskDetailsModal';
import MapDetails from '../Modals/mapDetailsModal';
import TrackDetails from '../Modals/trackDetailsModal';
import UncategorisedList from './uncategorizedList';
import StateWiseList from './stateWiseList';
import ZoneWiseList from './zoneWiseList';

class DashboardList extends Component{
    constructor(props) {
        super(props);
        this.state                  =   {
                                            editShow        :   false,
                                            detailsShow     :   false,
                                            mapShow         :   false,
                                            trackShow       :   false,
                                            visible         :   false,
                                            x               :   '',
                                            y               :   '',
                                            tasks           :   {},
                                            isLoading       :   true,
                                            mrchnt_address  :   '',
                                            recpnt_address  :   '',
                                            filteredList    :   [],
                                            listType        :   ''
                                        };
        this.snapshot               =   null;
        this.statefilter            =   [];
        this.areafilter             =   [];
        this.storefilter            =   [];
        this.arrangeData            =   this.arrangeData.bind(this);
        this.handleContextMenu      =   this.handleContextMenu.bind(this);
        this.openEditWindow         =   this.openEditWindow.bind(this);
        this.openDetailsWindow      =   this.openDetailsWindow.bind(this);
        this.openMapWindow          =   this.openMapWindow.bind(this);
        this.openTrackWindow        =   this.openTrackWindow.bind(this);
        this.deleteTask             =   this.deleteTask.bind(this);
        this.updateTask             =   this.updateTask.bind(this);
        this.handleClose            =   this.handleClose.bind(this);
    }

    openEditWindow(uuid, mrchnt_address, recpnt_address){
        this.props.getTaskDetails({uuid: uuid})
        this.setState({
            editShow        :   true,
            mrchnt_address  :   mrchnt_address,
            recpnt_address  :   recpnt_address
        })
    }

    openDetailsWindow(uuid){
        this.props.getTaskDetails({uuid: uuid})
        this.setState({
            detailsShow: true
        })
    }    

    openMapWindow(uuid){
        this.props.getTaskDetails({uuid: uuid});
        this.setState({
            mapShow: true
        })
    }

    openTrackWindow(e, data){
        e.stopPropagation();
        this.setState({
            trackShow: true,
            currentUrl: data.current_url,
            trackDriver: data.track_driver
        })
    }

    updateTask(uuid, status){
        if(window.confirm('Do you really want to update status of this task?')) {
            this.props.updateTaskStatus({uuid: uuid, status: status});
        }
    }

    deleteTask(uuid){
        if(window.confirm('Do you really want to delete this task?')) {
            this.props.deleteTask({uuid: uuid});
        }
    }
    
    handleClose(){
        //console.log('Handle Close');
        this.setState({
            visible     :   false,
            editShow    :   false,            
            mapShow     :   false,
            detailsShow :   false,
            trackShow   :   false
        })
    }

    handleContextMenu(event, order) {
        let self                   =  this;
        event.preventDefault();        
        const clickX               =  event.clientX;
        const clickY               =  event.pageY;
        self.setState({
            visible     :  true,
            x           :  clickX,
            y           :  clickY,
            selOrder    :  {...order}
        });
    }
    
    hideContextMenu = () => {
        this.setState({
            visible :   false,
            x       :   0,
            y       :   0
        });
    }

    componentDidMount() {
        //console.log('List Mounted ');
        this.statefilter        =   [...this.props.statefilter];
        this.areafilter         =   [...this.props.areafilter];
        this.storefilter        =   [...this.props.storefilter];
        let org_id              =   this.props.org_id || '';
        let task_type           =   this.props.type || '';
        this.getTasks({
            org_id          :   org_id,
            task_type       :   task_type,
            statefilter     :   this.props.statefilter,
            areafilter      :   this.props.areafilter,
            storefilter     :   this.props.storefilter
        });
    }

    componentWillReceiveProps(props) {
        //console.log('Will Receive Props Filter : ', props);
        if(this.props.type !== props.type
            || !!!this.unsubscribe) {
            this.statefilter        =   [...props.statefilter];
            this.areafilter         =   [...props.areafilter];
            this.storefilter        =   [...props.storefilter];
            let org_id              =   props.org_id || '';
            let task_type           =   props.type || '';
            this.getTasks({
                org_id          :   org_id,
                task_type       :   task_type,
                statefilter     :   props.statefilter,
                areafilter      :   props.areafilter,
                storefilter     :   props.storefilter
            });
        } else {
            if(this.searchTxt !== props.searchTxt
                || !isEqual(this.statefilter, props.statefilter)
                || !isEqual(this.areafilter, props.areafilter)
                || !isEqual(this.storefilter, props.storefilter)) {                    
                this.statefilter        =   [...props.statefilter];
                this.areafilter         =   [...props.areafilter];
                this.storefilter        =   [...props.storefilter];
                this.searchTxt          =   props.searchTxt;
                this.arrangeData();
            }
        }
    }

    componentWillUnmount() {
        //console.log('Subscribe : ', this.unsubscribe, !!this.unsubscribe)
        if(!!this.unsubscribe)
            this.unsubscribe();
    }

    getTasks(data){
        //console.log('called get tasks : ', data);
        if(!!this.unsubscribe)
            this.unsubscribe();
        let self            =   this;
        let org_id          =   data.org_id;
        let task_type       =   data.task_type;
        let statefilter     =   data.statefilter;
        //let areafilter      =   data.areafilter;
        //let storefilter     =   data.storefilter;
        let query           =   firebaseDb
        .collection("tasks")
        .where('org_id', '==', org_id)
        .where('tsk_type', '==', task_type);
        /*
        if(statefilter.length > 0) {
            let stateArr    =   _map(statefilter, 'value');
            if(stateArr.length > 0)
                query   =   query.where('state_code', 'in', [...stateArr]);
        }
        */
        /*
        if(areafilter.length > 0) {
            let areaArr    =   _map(areafilter, 'value');
            console.log('Area : ', areaArr);
            if(areaArr.length > 0)
                query   =   query.where('mkt_ofc_cty_del_zne_name', 'in', [...areaArr]);
        }
        if(storefilter.length > 0) {
            let storeArr    =   _map(storefilter, 'value');
            console.log('Store : ', storeArr);
            //if(storeArr.length > 0)
              //  query   =   query.where('state_code', 'in', [...storeArr]);
        }
        */
        this.unsubscribe    =   query
        //.where('mkt_ofc_cty_del_zne_id', 'in', [11, 13])
        //.where('org_id', 'in', [3, 2])
        .onSnapshot(function(querySnapshot) {
            self.snapshot   =   querySnapshot;
            self.arrangeData();
        })
    }

    arrangeData() {        
        let snapshot    =   this.snapshot;
        let store       =   [];
        let storeName   =   {};
        (this.storefilter || []).forEach((item) => {
            store.push(item.store_id);
            storeName[item.store_id]  =   item.label;
        })
        //console.log('Store Filter : ', store, storeName);
        let filter      =   {
            state       :   _map(this.statefilter, 'value'),
            area        :   _map(this.areafilter, 'value'),
            //store       :   _map(this.storefilter, 'store_id'),
            //storeName   :   map(this.storefilter) => 'label'),
            store       :   store,
            storeName   :   storeName,
            searchTxt   :   this.searchTxt
        }
        let result      =   sortTaskList(snapshot, filter);
        let tasks       =   result.tasks;
        let count       =   result.count;
        let type        =   result.type;
        this.setState({
            tasks       :   tasks,
            listType    :   type,
            isLoading   :   false
        }, () => {
            this.props.updateTotalCount(count || 0);
        })
    }

    render() {
        let tasks                       =   this.state.tasks || {};
        //console.log(tasks);
        return (  
            <div>                         
                <CustomContext
                    visible             =   {this.state.visible}
                    x                   =   {this.state.x}
                    y                   =   {this.state.y}
                    selOrder            =   {this.state.selOrder}
                    openEditWindow      =   {this.openEditWindow}
                    openDetailsWindow   =   {this.openDetailsWindow}
                    openMapWindow       =   {this.openMapWindow}
                    deleteTask          =   {this.deleteTask}
                    updateTask          =   {this.updateTask}
                    hideContextMenu     =   {this.hideContextMenu}
                />
                {
                    (!!!this.state.isLoading) ?
                    <div>
                        {
                            (this.state.listType === 'UncategorizedList') ? 
                                <UncategorisedList
                                    tasks               =   {tasks}
                                    openTrackWindow     =   {this.openTrackWindow}
                                    handleContextMenu   =   {this.handleContextMenu}
                                    shoppedLate         =   {this.props.shoppedLate}
                                />
                            : null
                        }
                        {
                            (this.state.listType === 'StateWiseList') ? 
                                <StateWiseList
                                    tasks               =   {tasks}
                                    openTrackWindow     =   {this.openTrackWindow}
                                    handleContextMenu   =   {this.handleContextMenu}
                                    shoppedLate         =   {this.props.shoppedLate}
                                />
                            : null
                        }
                        {
                            (this.state.listType === 'ZoneWiseList') ? 
                                <ZoneWiseList
                                    tasks               =   {tasks}
                                    openTrackWindow     =   {this.openTrackWindow}
                                    handleContextMenu   =   {this.handleContextMenu}
                                    shoppedLate         =   {this.props.shoppedLate}
                                />
                            : null
                        }
                        {
                            (!!this.state.editShow) ?
                            <EditTask
                                taskDetails         =   {this.props.taskDetails}
                                show                =   {this.state.editShow}
                                taskType            =   {this.props.taskType}
                                stores              =   {this.props.stores}
                                locations           =   {this.props.locations}
                                pharmacy            =   {this.props.pharmacy}
                                timings             =   {this.props.timings}
                                settingsData        =   {this.props.settingsData}
                                editTask            =   {this.props.editTask}
                                mrchnt_address      =   {this.state.mrchnt_address}
                                recpnt_address      =   {this.state.recpnt_address}
                                handleClose         =   {this.handleClose}
                            /> : null
                        }
                        {
                            /* (!!this.state.trackShow) ? */
                            <TrackDetails
                                show                =   {this.state.trackShow}
                                currentUrl          =   {this.state.currentUrl}
                                trackDriver         =   {this.state.trackDriver}
                                handleClose         =   {this.handleClose}
                            /> /* : null */
                        }
                        {
                            (!!this.state.detailsShow) ?
                            <TaskDetails
                                show                =   {this.state.detailsShow}
                                taskDetails         =   {this.props.taskDetails}
                                handleClose         =   {this.handleClose}
                            /> : null
                        }                    
                        {
                            (!!this.state.mapShow) ?
                            <MapDetails
                                show                =   {this.state.mapShow}
                                taskDetails         =   {this.props.taskDetails}
                                handleClose         =   {this.handleClose}
                            /> : null
                        }
                    </div> : <div className="loader">Loading....</div>
                }
            </div>
        )
    }
}
export default DashboardList;