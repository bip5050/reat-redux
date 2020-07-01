import React, { Component } from 'react';
import { Form } from 'reactstrap';
import moment from 'moment-timezone';
import CustomFilter from '../Dashboard/customFilter';
import EditTask from '../Modals/editTaskModal';
import TaskDetails from '../Modals/taskDetailsModal';
import MapDetails from '../Modals/mapDetailsModal';
import TrackDetails from '../Modals/trackDetailsModal';
import Calendar from '../../components/Calendar/calendar';
import StateFilter from '../Filter/stateFilter';
import AreaFilter from '../Filter/areaFilter';
import StoreFilter from '../Filter/storeFilter';
import {error as notifyerror} from '../../util/notify';
import {sortBy as _sortBy, isEmpty, remove as _remove} from 'lodash';
import {setFilter, getFilter, clearFilter} from '../../Helper/common';

class Filter extends Component{
   constructor(props) {
      super(props);
      this.state     =   {
         startDate   :   new Date(),
         from        :  undefined,
         to          :  undefined,         
         editShow        :   false,
         detailsShow     :   false,
         mapShow         :   false,
         trackShow       :   false,
         visible         :   false,
         show                 :  false,
         selectedState        :  null,
         selectedArea         :  null,
         selectedStore        :  null,
         filterKeys           :  {State:[], Area: [], Store: []},
         storeTxt: '',
         stOpen: false,
         showSearch: false,
         showFilter: false,
         filteredList: {},
         startDate      :  moment().subtract(1, 'months').format('YYYY-MM-DD'),
         endDate        :  moment().format('YYYY-MM-DD'),
         pageno         :  1,
         noofdays       :  '',
         type           :  ''

      }
      
      this.handleChange       =  this.handleChange.bind(this);
      this.handleFromChange   =  this.handleFromChange.bind(this);
      this.handleToChange     =  this.handleToChange.bind(this);
      this.timings                  =  [];
      this.handleExportTaskCsv      =  this.handleExportTaskCsv.bind(this);
      this.handleSearchClose        =  this.handleSearchClose.bind(this);
      this.handleRemoveFilter       =  this.handleRemoveFilter.bind(this);
      this.onChangeHandle           =  this.onChangeHandle.bind(this);
      this.toggleCustomSearch       =  this.toggleCustomSearch.bind(this);
      this.toggleResFilter          =  this.toggleResFilter.bind(this);
      this.openEditWindow             =   this.openEditWindow.bind(this);
      this.openDetailsWindow          =   this.openDetailsWindow.bind(this);
      this.openMapWindow              =   this.openMapWindow.bind(this);
      this.openTrackWindow            =   this.openTrackWindow.bind(this);
      this.deleteTask                 =   this.deleteTask.bind(this);
      this.updateTask                 =   this.updateTask.bind(this);
      this.handleClose                =   this.handleClose.bind(this);
   }

   onSelectStartDate = (date) => {
      let startDate        =  moment(date).format('X');      
      let endDate          =  moment(this.state.endDate).format('X');
      //console.log(startDate, endDate, startDate > endDate);
      if(startDate > endDate){
         notifyerror({message: 'Start date should be lower than end date'});
         return false;
      }
      this.setState({
         startDate   :  date
      }, () => {
         this.handleGetHistory();
      })
   }

   onSelectEndDate = (date) => {
      let startDate        =  moment(this.state.startDate).format('X');      
      let endDate          =  moment(date).format('X');
      //console.log(startDate, endDate, endDate < startDate);
      if(!!!this.state.startDate) {
         notifyerror({message: 'Please select start date first'});
         return false;
      }
      if(endDate < startDate){
         notifyerror({message: 'End date should be greater than start date'});
         return false;
      }
      this.setState({
         endDate   :  date
      }, () => {
         this.handleGetHistory();
      })

   }

   onDateRange = (date) => {
      this.setState({
         startDate   :  date.startDate,
         endDate     :  date.endDate,
         noofdays    :  date.noofdays
      }, () => {
         this.handleGetHistory();
      })
   }

   handleGetHistory() {
      let filterKeys       =  this.state.filterKeys || {};
      let value_one        =  '';
      let value_two        =  '';
      let storeName        =  {};

      if(filterKeys.Store.length === 0 && filterKeys.Area.length === 0 && filterKeys.State.length > 0) {
         let states           =  (filterKeys.State || []).map(item => item.value);
         if(states.length > 0){
            value_one         =  'state';
            value_two         =  states;
         }
      }

      if(filterKeys.Store.length === 0 && filterKeys.Area.length > 0) {         
         let zones           =  [];
         (filterKeys.Area || []).map((item) => {
            if(!!zones[item.state]){
               zones[item.state].zone_id.push(item.id)
            } else {
               zones.push({
                  state: item.state,
                  zone_id : [item.id]
               })
            }
         });

         //console.log('Zones : ', zones);
         if(zones.length > 0){
            value_one         =  'zone';
            value_two         =  zones;  
         }
      }

      if(filterKeys.Store.length > 0) {
         let store            =  [];
         (filterKeys.Store || []).forEach(item => {
            store.push(item.store_id.toString());
            storeName[item.store_id]   = item.label;
         })
         if(store.length > 0){
            value_one         =  'store-id';
            value_two         =  store;
         }
      }

      let startDate           =  this.state.startDate;
      let endDate             =  this.state.endDate;
      if(!!startDate && !!endDate) {
         startDate            =  startDate;
         endDate            =  endDate;
      } else {
         if(!!!startDate && !!!endDate) {
            startDate            =  moment().subtract(1, 'months').format('YYYY-MM-DD');
            endDate            =  moment().format('YYYY-MM-DD');
         }
         if(!!startDate && !!!endDate) {
            startDate         =  startDate;
            endDate         =  startDate;
         }
         if(!!endDate && !!!startDate) {
            startDate         =  endDate;
            endDate         =  endDate;
         }
         this.setState({
            startDate      :  value_one,
            endDate        :  value_two
         })
      }

      let data             =  {
         start       :  startDate,
         end         :  endDate,
         value_one   :  (!!value_one) ? value_one : 'date',
         value_two   :  value_two,
         pageno      :  1,
         type        :  this.state.type
      }
      if(value_one === 'store-id') {
         data.storeName    =  storeName;
      }
      //console.log('Parent Props : ', this.state.type, this.props.filterData);
      this.props.getHistory(data, {
         user_type   :  this.props.userType,
         type        :  this.state.type,
         startDate   :  startDate,
         endDate     :  endDate,
         filterKeys  :  filterKeys,
         pageno      :  1
      });
   }

   handleStateChange = (e, selectedState) => {
      e.stopPropagation();
      let filterKeys          =  this.state.filterKeys || {};
      let selIndex            =  filterKeys.State.findIndex((item) => {
         return item.value === selectedState.value;
      })
      if(selIndex === -1) {
         filterKeys.State.push({
            label    :  selectedState.label,
            value    :  selectedState.value
         })
      }
      filterKeys.State     =  _sortBy(filterKeys.State, 'value');
      this.setState({
         filterKeys: filterKeys
      }, () => {
            this.handleGetHistory();
      });
   }

   handleAreaChange           =  (e, selectedArea) => {
      e.stopPropagation();
      let filterKeys          =  this.state.filterKeys || {};
      let selIndex            =  filterKeys.Area.findIndex((item) => {
         return item.value === selectedArea.delivery_zone_name;
      })
      if(selIndex === -1) {
         filterKeys.Area.push({
            label    :  `${selectedArea.delivery_zone_name} (${selectedArea.state})`,
            value    :  selectedArea.delivery_zone_name,
            state    :  selectedArea.state,
            id       :  selectedArea.id
         })
      }
      filterKeys.Area     =  _sortBy(filterKeys.Area, 'value');
      this.setState({
         //selectedArea,
         filterKeys: filterKeys
      }, () => {
            this.handleGetHistory();
      });
   };
   
   handleStoreChange          =  (e, selectedStore) => {
      e.stopPropagation();
      let filterKeys          =  this.state.filterKeys || {}; 
      let selIndex            =  filterKeys.Store.findIndex((item) => {
         return item.value === selectedStore.label;
      })
      if(selIndex === -1) {
         filterKeys.Store.push({
            store_id :  selectedStore.data.store_id,
            id       :  selectedStore.data.id,
            label    :  selectedStore.label,
            value    :  selectedStore.label,
         })
      }
      filterKeys.Store     =  _sortBy(filterKeys.Store, 'value');
      this.setState({
         //selectedStore,
         filterKeys: filterKeys
      }, () => {
            this.handleGetHistory();
      });
   };

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
            visible     :  false,
            show        :  false,
            editShow    :  false,            
            mapShow     :  false,
            detailsShow :  false,
            trackShow   :  false
         })
   }

   toggleCustomSearch() {
      this.setState({
         showFilter  :  false,
         showSearch  :  !this.state.showSearch,
         sOpen       :  false,
         aOpen       :  false,
         stOpen      :  false

      })
   }

   toggleResFilter() {
      this.setState({
         showSearch:false,
         showFilter: !this.state.showFilter
      })
   }
   
   handleExportTaskCsv() {
      this.props.exportTaskCsv(this.props.filterData);
   };

   handleSearchClose() {
      this.setState({
         show: false
      }, function (){

      })
   }

   timing(start, end) {
      //console.log('Start End : ', start, end);
      let today = moment().format('MM/DD/YYYY');
      let now = moment().unix();
      let gap = 30 * 60;
      let key = "";
      let stimestamp = moment(today+' '+start, 'MM/DD/YYYY H:mm').unix();
      let etimestamp = moment(today+' '+end, 'MM/DD/YYYY H:mm').unix();
      let from = [];
      let to = [];
      for(let i=stimestamp; i<etimestamp; i=i+gap) {
         from.push({
            label :  moment(i*1000).format('hh:mm A'),
            value :  moment(i*1000).format('HH:mm:ss')
         });
         to.push({
            label :  moment((i+gap)*1000).format('hh:mm A'),
            value :  moment((i+gap)*1000).format('HH:mm:ss')
         });
         if(now >= i && now <= i+gap ) {
            key = moment(i*1000).format('hh:mm A')+'-'+moment((i+gap)*1000).format('hh:mm A');
         }
      }
      return {from:from, to:to, key: key};
   }
   
   showFromMonth() {
      const { from, to } = this.state;
      if (!from) {
      return;
      }
      if (moment(to).diff(moment(from), 'months') < 2) {
      this.to.getDayPicker().showMonth(from);
      }
   }

   handleFromChange(from) {
      // Change the from date and focus the "to" input field
      this.setState({ from });
   }

   handleToChange(to) {
      this.setState({ to }, this.showFromMonth);
   } 



   handleChange = recipient_location => {
      this.setState({ recipient_location });
   };

   componentDidMount() {
      let self             =  this;
      this.timings         =  this.timing(this.props.settingsData.start_time, this.props.settingsData.end_time);                
      let fromDate         =  this.state.startDate;
      let toDate           =  this.state.endDate;
      let pageno           =  this.state.pageno || 1;
      let filterKeys =  this.state.filterKeys;
		let filter     =  this.props.savedFilterData;
      //console.log('Filter Did Mount : ', filter);
      if(!isEmpty(filter) && filter.user_type === this.props.userType) {
         filterKeys  =  filter.filterKeys;
         //fromDate    =  filter.startDate || fromDate;
         //toDate      =  filter.endDate || toDate;
         this.setState({
            filterKeys  :  filter.filterKeys,
            startDate   :  fromDate,
            endDate     :  toDate,
            type        :  filter.type
         }, () => {
            this.handleGetHistory();
         })
      } else {
         let type       =  (this.props.userType === 'admin') ? 'general' : this.props.userType;
         this.setState({
            type : type
         }, () => {
            this.handleGetHistory();
         })
      }
      document.addEventListener('click', this.handleClick);
   }
     
   handleClick = (e) => {
      e.stopPropagation();
      if(this.nodeSearch.contains(e.target)
         || this.nodeSrchButton.contains(e.target)
         || this.nodeResSrchButton.contains(e.target)
         || e.target.getAttribute('data') === 'autosuggest'
         || e.target.getAttribute('data') === 'ignore-outer-click'
         || !!e.target.getAttribute('aria-hidden')
         //|| !!!this.state.showSearch
         )
         return;
      if(!!this.state.showSearch) {
         this.setState({
            showSearch  :  false
         })
      }
   }
  
   handleRemoveFilter(e, type, index) {
      //console.log('handle remove');
      e.stopPropagation();
      let filters          =  this.state.filterKeys || [];
      if(type === 'State') {
         let stateCode     =  filters[type][index].value;
         _remove(filters.Area, function (area) {
            return area.state === stateCode;
         });
      }
      filters[type].splice(index, 1);
      if(type === 'State' && filters[type].length === 0){
         filters.Area      =  [];
         filters.Store     =  [];
      }
      if(type === 'Area' && filters[type].length === 0){
         filters.Store     =  [];
      }
      let selectedState    =  (type !== 'State') ? this.state.selectedState : null;
      let selectedArea     =  (type !== 'Area') ? this.state.selectedArea : null;
      let selectedStore    =  (type !== 'Store') ? this.state.selectedStore : null;
      this.setState({
         filterKeys : filters,
         selectedState: selectedState,
         selectedArea: selectedArea,
         selectedStore: selectedStore
      }, () => {
         this.handleGetHistory();
      });
   }

  
   onChangeHandle(e) {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({ [name]: value }, function () {
      });
   }
  
   componentWillReceiveProps(props) {
      if(props.csvUrl && props.csvUrl !== this.props.csvUrl){
         window.open(props.csvUrl.Location.filepath);
      }
      this.setState({ filteredList: props.filteredList });
   }

   componentWillUnmount() {
      document.removeEventListener('click', this.handleClick);
   }

   handleTypeChange = (type) => {
      this.setState({
         type: type
      }, () => {
         this.handleGetHistory();
      })
   }

   render(){
      //console.log('Type : ', this.state.type);
      let taskHistory         =   this.props.taskHistory || {};
      let taskCount           =   0;
      if (!isEmpty(taskHistory)) {
         taskCount            =   taskHistory.task_count || 0;
      }
      const { from, to }   =  this.state;
      const modifiers      =  { start: from, end: to };
      let locations              =  this.props.locations || [];      
      let stateFilter = [];
      let stateCodeFilter = [];
      this.state.filterKeys.State.forEach((state) => {
         stateFilter.push(state.label);
         stateCodeFilter.push(state.value);
      });
      return (  
         <div>
            <section className="con_top">
               <div className="tab_pan-wrap">
                  <div className="tab_pan">
                     <span onClick={() => this.handleTypeChange('general')} className={(this.state.type === 'general') ? ' active' : ''}>Grocery</span>
                     <span onClick={() => this.handleTypeChange('pharmacy')} className={(this.state.type === 'pharmacy') ? ' active' : ''}>Rx</span>
                  </div>
               </div>
               <div className="res_btn">
                  <div className={`resfilter_btn ${this.state.showFilter ? "showfilter" : ""} `} onClick={this.toggleResFilter}><img src="/assets/search-ico.svg" alt="Search_ico" /> Filter</div>
                  <div ref={nodeResSrchButton => this.nodeResSrchButton = nodeResSrchButton} className={`searchmod_btn ${this.state.showSearch ? "showpoint" : ""} `} onClick={this.toggleCustomSearch}><img src="/assets/search-ico.svg" alt="Search_ico" /> Search</div>
               </div>
               <Form method="get" action="" autoComplete="off" className={`resfilter_box ${this.state.showFilter ? "showfilterbox":""}`}>
                  <div className="filter_label">Filter by: </div>
                  <StateFilter
                     stateFilter={stateFilter}
                     states={this.state.filterKeys.State}
                     handleStateChange={this.handleStateChange}
                     handleRemoveFilter={this.handleRemoveFilter}
                  />
                  <AreaFilter
                     area={this.state.filterKeys.Area}
                     states={this.state.filterKeys.State}
                     zones={this.props.zones}
                     stateCodeFilter={stateCodeFilter}
                     handleAreaChange={this.handleAreaChange}
                     handleRemoveFilter={this.handleRemoveFilter}
                  />
                  <StoreFilter
                     store={this.state.filterKeys.Store}
                     area={this.state.filterKeys.Area}
                     stores={this.props.stores}
                     handleStoreChange={this.handleStoreChange}
                     handleRemoveFilter={this.handleRemoveFilter}
                  />
               </Form>
               <div className="search_sec">
                  <div ref={nodeSrchButton => this.nodeSrchButton = nodeSrchButton} className={`searchmod_btn ${this.state.showSearch ? "showpoint" : ""} `} onClick={this.toggleCustomSearch}><img src="/assets/search-ico.svg" alt="Search_ico" /> Search</div>
                  {
                     this.props.isTaskCsvExporting?
                     <button type="button" className="btn btn-info btn-lg btn_blue">Exporting...</button>:<button type="button" onClick={this.handleExportTaskCsv} className="btn btn-info btn-lg btn_blue">Export CSV</button>
                  }
                  
               </div>
            </section>
            <section className="date_range_section">
               <div className="filter_label">Range: </div>
               <div className="InputFromTo">
                  <div className="DayPickerInput">
                     <Calendar
                        selectDate={this.state.startDate}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        noofdays={this.state.noofdays}
                        onSelectDate={this.onSelectStartDate}
                        onDateRange={this.onDateRange}
                        className="t_box"
                        placeholder="Start Date"
                     />
                  </div>
                  {' '}
                  <span className="to">to</span> {' '}
                  <span className="InputFromTo-to">
                     <div className="DayPickerInput">
                        <Calendar
                           selectDate={this.state.endDate}
                           startDate={this.state.startDate}
                           endDate={this.state.endDate}
                           noofdays={this.state.noofdays}
                           onSelectDate={this.onSelectEndDate}
                           onDateRange={this.onDateRange}
                           className="t_box"
                           placeholder="End Date"
                           disabled={!!!this.state.startDate}
                        />
                     </div>
                  </span>
               </div>
            </section>
            {
               (taskCount > 0) ? <div className="liveOrders">{taskCount} Tasks</div> : null
            }
            {
            (this.state.filterKeys.State.length > 0 || this.state.filterKeys.Area.length > 0 || this.state.filterKeys.Store.length > 0) ?
            <section className="filter-tag_section">
               {
                  (this.state.filterKeys.State.length > 0) ?
                     this.state.filterKeys.State.map((filter, index) => {
                        return (
                           <span key={index} className="f-tag">{filter.label}
                              <a onClick={(e) => this.handleRemoveFilter(e, 'State', index)}>
                                 <img src="/assets/cancel-ico.svg" alt="close" />
                              </a>
                           </span>
                        )
                     }) : null
               }
               {
                  (this.state.filterKeys.Area.length > 0) ?
                     this.state.filterKeys.Area.map((filter, index) => {
                        return (
                           <span key={index} className="f-tag">{filter.label}
                              <a onClick={(e) => this.handleRemoveFilter(e, 'Area', index)}>
                                 <img src="/assets/cancel-ico.svg" alt="close" />
                              </a>
                           </span>
                        )
                     }) : null
               }
               {
                  (this.state.filterKeys.Store.length > 0) ?
                     this.state.filterKeys.Store.map((filter, index) => {
                        return (
                           <span key={index} className="f-tag">{filter.label}
                              <a onClick={(e) => this.handleRemoveFilter(e, 'Store', index)}>
                                 <img src="/assets/cancel-ico.svg" alt="close" />
                              </a>
                           </span>
                        )
                     }) : null
               }
            </section>:null
         }
            <div
               ref={nodeSearch => this.nodeSearch = nodeSearch}>
               <CustomFilter
                  filteredList={this.state.filteredList}
                  settingsData={this.props.settingsData}
                  timings={this.timings}
                  searchFilter={this.props.searchFilter}
                  resetSearch={this.props.resetSearch}
                  showSearch={this.state.showSearch}
                  getTaskDetails={this.props.getTaskDetails}
                  taskDetails={this.props.taskDetails}
                  deleteTask={this.props.deleteTask}
                  updateTaskStatus={this.props.updateTaskStatus}
                  editTask={this.props.editTask}
                  getTrackDetails={this.props.getTrackDetails}
                  openEditWindow={this.openEditWindow}
                  openDetailsWindow={this.openDetailsWindow}
                  openMapWindow={this.openMapWindow}
                  deleteTask={this.deleteTask}
                  updateTask={this.updateTask}
                  openTrackWindow={this.openTrackWindow}
                  section='All Tasks'
               />
               {
                  (!!this.state.editShow) ?
                     <EditTask
                        taskDetails={this.props.taskDetails}
                        show={this.state.editShow}
                        timings={this.props.timings}
                        settingsData={this.props.settingsData}
                        editTask={this.props.editTask}
                        mrchnt_address={this.state.mrchnt_address}
                        recpnt_address={this.state.recpnt_address}
                        handleClose={this.handleClose}
                     /> : null
               }
               {
                  //(!!this.state.trackShow) ?
                  <TrackDetails
                     show={this.state.trackShow}
                     currentUrl={this.state.currentUrl}
                     trackDriver={this.state.trackDriver}
                     handleClose={this.handleClose}
                  /> //: null
               }
               {
                  (!!this.state.detailsShow) ?
                     <TaskDetails
                        show={this.state.detailsShow}
                        taskDetails={this.props.taskDetails}
                        handleClose={this.handleClose}
                     /> : null
               }
               {
                  (!!this.state.mapShow) ?
                     <MapDetails
                        show={this.state.mapShow}
                        taskDetails={this.props.taskDetails}
                        handleClose={this.handleClose}
                     /> : null
               }
            </div>
         </div>
      )
   }
}
export default Filter;