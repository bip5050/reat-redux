import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'reactstrap';
import CreateTask from '../Modals/createTaskModal';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import CustomFilter from './customFilter';
import EditTask from '../Modals/editTaskModal';
import TaskDetails from '../Modals/taskDetailsModal';
import MapDetails from '../Modals/mapDetailsModal';
import TrackDetails from '../Modals/trackDetailsModal';
import StateFilter from '../Filter/stateFilter';
import AreaFilter from '../Filter/areaFilter';
import StoreFilter from '../Filter/storeFilter';
import {isEqual, isEmpty, sortBy as _sortBy, remove as _remove} from 'lodash';

class Filter extends Component {
   constructor(props) {
      super(props);
      this.state              =  {           
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
         showSearch: false,
         showFilter: false,
         filteredList: {}
      }
      this.interval                 =  null;
      this.timings                  =  [];
      this.handleShow               =  this.handleShow.bind(this);
      this.handleSearchClose              =  this.handleSearchClose.bind(this);
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
   
   handleShow() {
      this.setState({
         show: true
      })
   }

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

   componentDidMount() {
      let filter     =  this.props.filterData;
      //console.log('Dashboard Filter Parent Props : ', this.props.userType, filter.user_type);
      if(!isEmpty(filter) && filter.user_type === this.props.userType) {
			//type        =  filter.type;
			this.setState({
				filterKeys  :  filter.filterKeys,
				type        :  filter.type
			}, () => {
            //console.log('Did Mount : ', filter.filterKeys, this.state);
            this.getShoppedLate();
			})
		} else {
			let type       =  (this.props.userType === 'admin') ? 'general' : this.props.userType;
			this.setState({
				type : type
			}, () => {
            this.handleUpdateFilter();
            this.getShoppedLate();
			})
		}
      let self = this;
      this.timings = this.timing(this.props.settingsData.start_time, this.props.settingsData.end_time);
      document.addEventListener('click', this.handleClick, false);
      /* document.addEventListener("click", function(event){
         event.stopPropagation();
         self.setState({ sOpen: false, aOpen:false, stOpen:false});
      }); */
   }

   getShoppedLate = () => {
      this.setIntervalSummary();
      this.props.getShoppedLate();
   }

   setIntervalSummary = () => {  
      //console.log('Set Interval Done')    
      if(!!this.interval)
         clearInterval(this.interval);
      this.interval = setInterval(() => {
         this.props.getShoppedLate();
      }, 1000 * 60 * 10);
   }
   
   handleClick = (e) => {
      e.stopPropagation();
      if(this.nodeSearch.contains(e.target)
         || this.nodeSrchButton.contains(e.target)
         || this.nodeResSrchButton.contains(e.target)
         || e.target.getAttribute('data') === 'autosuggest'
         || e.target.getAttribute('data') === 'ignore-outer-click'
         || !!e.target.getAttribute('aria-hidden')
         || !!this.state.editShow
         //|| !!!this.state.showSearch
         )
         return;
      if(!!this.state.showSearch) {
         this.setState({
            showSearch  :  false
         })
      }
   }   

   handleStateChange = (e, selectedState) => {
      //console.log('handle state change');
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
      if(filterKeys.State.length === 0){
         filterKeys.Store     =  [];
         filterKeys.Area      =  [];
      }
      this.setState({
         //selectedState,
         filterKeys: filterKeys
      }, () => {
         this.handleUpdateFilter()
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
      if(filterKeys.Area.length === 0){
         filterKeys.Store      =  [];
      }
      this.setState({
         //selectedArea,
         filterKeys: filterKeys
      }, () => {
         this.handleUpdateFilter()
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
            id          :  selectedStore.data.id,
            store_id    :  selectedStore.data.store_id,
            label       :  selectedStore.label,
            value       :  selectedStore.label,
         })
      }
      filterKeys.Store     =  _sortBy(filterKeys.Store, 'value');
      this.setState({
         //selectedStore,
         filterKeys: filterKeys
      }, () => {
         this.handleUpdateFilter()
      });
   };

   handleRemoveFilter = (e, type, index) => {
      //console.log('handle remove');
      e.stopPropagation();
      let filters          =  this.state.filterKeys || [];
      if(type === 'State') {
         let stateCode     =  filters[type][index].value;
         _remove(filters.Area, function (area) {
            return area.state === stateCode;
         });
      }
      /* if(type === 'Area') {
         let stateCode     =  filters[type][index].value;
         _remove(filters.Area, function (area) {
            return area.state === stateCode;
         });
      } */
      filters[type].splice(index, 1);
      let selectedState    =  (type !== 'State') ? this.state.selectedState : null;
      let selectedArea     =  (type !== 'Area') ? this.state.selectedArea : null;
      let selectedStore    =  (type !== 'Store') ? this.state.selectedStore : null;
      if(filters.State.length === 0){
         filters.Store     =  [];
         filters.Area      =  [];
      }
      if(filters.Area.length === 0){
         filters.Store      =  [];
      }

      this.setState({
         filterKeys : filters,
         selectedState: selectedState,
         selectedArea: selectedArea,
         selectedStore: selectedStore
      }, () => {
         this.handleUpdateFilter()
      });
   }

   handleTypeChange(type) {
      this.setState({
			type: type
		}, () => {
			this.handleUpdateFilter();
		})
   }

   handleUpdateFilter = () => {
      /* console.log('Update Filter : ', {
         user_type:this.props.userType,
         type: this.state.type,
         filterKeys: this.state.filterKeys || {}
      }) */
      this.props.updateFilter({
         user_type:this.props.userType,
         type: this.state.type,
         filterKeys: this.state.filterKeys || {}
      });
   }

   onChangeHandle(e) {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({ [name]: value }, function () {
      });
   }

   componentWillReceiveProps(props) {
      if(!isEqual(this.props.filterData, props.filterData)) {
         let filter     =  props.filterData;
         if(!isEmpty(filter) && filter.user_type === props.userType) {
            //type        =  filter.type;
            this.setState({
               filterKeys  :  filter.filterKeys,
               type        :  filter.type,
               filteredList: props.filteredList
            }, () => {
               //console.log('Did Mount : ', filter.filterKeys, this.state);
               //this.handleUpdateFilter();
            })
         } else {
            let type       =  (props.userType === 'admin') ? 'general' : props.userType;
            this.setState({
               type : type,
               filteredList: props.filteredList
            }, () => {
               this.handleUpdateFilter();
            })
         }
      } else {
         this.setState({
            //filterKeys: props.filterKeys,
            filteredList: props.filteredList
         })
      }
      //}
   }

   componentWillUnmount() {
      document.removeEventListener('click', this.handleClick);
      clearInterval(this.interval);
      /* document.removeEventListener("click", function(){
      }); */
   }

   render() {
      //console.log('Render Filter : ', this.state.filterKeys, this.state);
      //let timings                =  (!!this.timings && !!this.timings.data) ? this.timings.data : [];
      let stores                 =  this.props.stores || [];
      let locations              =  this.props.locations || [];
      let zones                  =  this.props.zones || {};
      let statesLocalStorage     =  JSON.parse(localStorage.getItem('states') || '[]');      
      let states                 =  statesLocalStorage.map((item) => {
         return {
            label: item.value,
            value: item.id
         }
      })
      let stateFilter = [];
      let stateCodeFilter = [];
      this.state.filterKeys.State.forEach((state) => {
         stateFilter.push(state.label);
         stateCodeFilter.push(state.value);
      });
      let areaFilter = this.state.filterKeys.Area.map(area => area.value);
      let storeFilter = this.state.filterKeys.Store.map(store => store.label);
      let zoneList = stateCodeFilter.map(state => {
         return { state: state, zones: zones[state] }
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
                     <div className={`resfilter_btn ${this.state.showFilter ? "showfilter":""} `} onClick={this.toggleResFilter}><img src="/assets/search-ico.svg" alt="Search_ico" /> Filter</div>
                     <div ref={nodeResSrchButton => this.nodeResSrchButton = nodeResSrchButton} className={`searchmod_btn ${this.state.showSearch ? "showpoint":""} `} onClick={this.toggleCustomSearch}><img src="/assets/search-ico.svg" alt="Search_ico" /> Search</div>
                  </div>
                  <Form method="get" action="" autoComplete="off" className={`resfilter_box ${this.state.showFilter ? "showfilterbox":""}`} >
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
                  <div ref={nodeSrchButton => this.nodeSrchButton = nodeSrchButton} className={`searchmod_btn ${this.state.showSearch ? "showpoint":""} `} onClick={this.toggleCustomSearch}><img src="/assets/search-ico.svg" alt="Search_ico" /> Search</div>
                  <button type="button" onClick={this.handleShow} className="btn btn_blue">Create Task <img src="/assets/plus.svg" alt="" /></button>
               </div>
            </section>
            {
               (this.props.liveOrderCount !== '') ? <div className="liveOrders">{this.props.liveOrderCount} {(this.props.liveOrderCount <= 1) ? 'Live Order' : 'Live Orders'}</div> : null
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
                  filteredList         =  {this.state.filteredList}
                  settingsData         =  {this.props.settingsData}
                  timings              =  {this.timings}
                  searchFilter         =  {this.props.searchFilter}
                  resetSearch          =  {this.props.resetSearch}
                  showSearch           =  {this.state.showSearch}
                  getTaskDetails       =  {this.props.getTaskDetails}
                  taskDetails          =  {this.props.taskDetails}
                  deleteTask           =  {this.props.deleteTask}
                  updateTaskStatus     =  {this.props.updateTaskStatus}
                  editTask             =  {this.props.editTask}
                  getTrackDetails      =  {this.props.getTrackDetails}
                  openEditWindow       =  {this.openEditWindow}
                  openDetailsWindow    =  {this.openDetailsWindow}
                  openMapWindow        =  {this.openMapWindow}
                  deleteTask           =  {this.deleteTask}
                  updateTask           =  {this.updateTask}
                  openTrackWindow      =  {this.openTrackWindow}
                  section              =  'Dashboard'
                  userType             =  {this.state.type}
               />
            </div>
            <CreateTask
               type                 =  {this.state.type}
               show={this.state.show}
               handleClose={this.handleClose}
               getLocations={this.props.getLocations}
               taskType={this.props.taskType}
               stores={this.props.stores}
               locations={this.props.locations}
               pharmacy={this.props.pharmacy}
               timings={this.props.timings}
               userData={this.props.userData}
               settingsData={this.props.settingsData}
               createTask={this.props.createTask}
               isTaskProcessing     =  {this.props.isTaskProcessing}
            />            
            {
               (!!this.state.editShow) ?
               <EditTask
                  taskDetails         =   {this.props.taskDetails}
                  show                =   {this.state.editShow}
                  timings             =   {this.props.timings}
                  settingsData        =   {this.props.settingsData}
                  editTask            =   {this.props.editTask}
                  mrchnt_address      =   {this.state.mrchnt_address}
                  recpnt_address      =   {this.state.recpnt_address}
                  handleClose         =   {this.handleClose}
               /> : null
            }
            {
               //(!!this.state.trackShow) ?
               <TrackDetails
                  show                =   {this.state.trackShow}
                  currentUrl          =   {this.state.currentUrl}
                  trackDriver         =   {this.state.trackDriver}
                  handleClose         =   {this.handleClose}
               /> //: null
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
         </div>
      )
   }
}
export default withRouter(Filter);