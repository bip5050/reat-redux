import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import DashboardList from './dashboardList';
import {isEqual, isEmpty, sortBy as _sortBy, remove as _remove} from 'lodash';
import Filter from './filter';
import StateFilter from '../Filter/stateFilter';
import {setFilter, getFilter, clearFilter} from '../../Helper/common';

class DashboardComponent extends Component {
   static propTypes = {
      userData    :  PT.object
   }

   static defaultProps = {
      userData    :  {}
   }

   constructor(props) {
      super(props);
      this.state                    =  {
                                          org_id         :  (!!this.props.userData) ? this.props.userData.org_id : '',
                                          //selectedState  :  null,
                                          //selectedArea   :  null,
                                          //selectedStore  :  null,
                                          //filterKeys     :  {State:[], Area: [], Store: []},
                                          //type           :  'general',
                                          searchTxt      :  '',
                                          sOpen          :  false,
                                          selOrder       :  {},
                                          liveOrderCount :  '',
                                          filterData     :  {}
                                       }
      this.timings                  =  [];
      //this.handleTypeChange         =  this.handleTypeChange.bind(this);
      //this.handleRemoveFilter       =  this.handleRemoveFilter.bind(this);
      this.searchFilter             =  this.searchFilter.bind(this);
   }

   /* handleTypeChange(type) {
      this.setState({
         type        :  type
      })
      setFilter('dashboard', {user_type:this.props.userType, type: type, filterKeys: this.state.filterKeys || {}});
      this.props.updateFilter();
   } */

   searchFilter (searchData) {
      //console.log('Search Data : ', searchData);
      this.props.search({
         ...searchData,
         //user_type: this.state.type
      })
   }

   /* handleRemoveFilter (type, index) {
      let filters          =  this.state.filterKeys || [];
      if(type === 'State') {
         let stateCode     =  filters[type][index].value;
         _remove(filters.Area, function (area) {
            return area.state === stateCode;
         });
      }
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
      });      
      setFilter('dashboard', {user_type:this.props.userType, type: this.state.type, filterKeys: filters});
      this.props.updateFilter();
   } */

   componentDidMount() {
      //console.log('Props Added : ', this.props);
      this.setState({
         filterData: this.props.filterData.dashboard || {}
      })
      /* let type       =  '';
      let filterKeys =  this.state.filterKeys;
      if(!!this.props.userType){
         //let filter     =  getFilter('dashboard');         
		   let filter     =	this.props.filterData.reports || {};
         if(!isEmpty(filter) && filter.user_type === this.props.userType) {
            type        =  filter.type;
            filterKeys  =  filter.filterKeys;
         } else {
            type       =  (this.props.userType === 'admin') ? 'general' : this.props.userType;
            this.props.updateFilter();
         }
      }
      this.setState({
         type        :  type,
         filterKeys  :  filterKeys
      }) */
   }

   componentWillReceiveProps(props) {
      //console.log('Props Updated : ', props.shoppedLate);
      this.setState({
         filterData: props.filterData.dashboard || {}
      })
      /* if(!!props.userType && !isEqual(this.props.userType, props.userType)) {
         let type       =  (props.userType === 'admin') ? 'general' : props.userType;
         //let filterKeys =  this.state.filterKeys;
         //let filter     =  this.props.filterData.reports || {};
         
         if(!!props.userType){
            //let filter     =  getFilter('');
            let filter     =	props.filterData.reports || {};
            if(!isEmpty(filter) && filter.user_type === props.userType) {
               type        =  filter.type;
               filterKeys  =  filter.filterKeys;
            } else {
               type       =  (props.userType === 'admin') ? 'general' : props.userType;
               this.props.updateFilter();
            }
         }
         this.setState({
            type        :  type,
            filterKeys  :  filterKeys
         })
      } */
   }

   updateFilter = (data) => {
      this.setState({
         filterData: {...data}
      })
      this.props.updateFilter({...data});
   }
   updateTotalCount = (count) => {
      this.setState({
         liveOrderCount    :  count
      })
   }

   getShoppedLate = () => {
      let filterData    =  this.state.filterData || {};
      let filterKeys    =  filterData.filterKeys || {};
      let type          =  (this.props.userType === 'admin') ? 'general' : this.props.userType;
      let data				=	{}
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
         data.user_type		=	filterData.type || type;
         if(!!!data.type) {
            data.type      =  'default';
         }
         this.props.getShoppedLate(data);
      }
      //console.log('Filter Data : ', data);
   }

   render() {
      //console.log('Filter Data : ', this.state.filterKeys, this.state.type);
      let locationData           =  this.props.locations || {};
      let pharmacy               =  (!!locationData.pharmacy) ? locationData.pharmacy : false;
      let stores                 =  locationData.stores || [];
      let locations              =  locationData.locations || [];
      let taskType               =  locationData.taskType || '';
      let zones                  =  locationData.zones || {};
      let userType               =  this.props.userType || {};
      /* let filterData             =  {};
      if(!!this.props.userType){
         //let filter     =  getFilter('');
         let filter     =	this.props.filterData.dashboard || {};
         if(!isEmpty(filter) && filter.user_type === this.props.userType) {
            filterData.type         =  filter.type;
            filterData.filterKeys   =  filter.filterKeys;
         } else {
            filterData.type         =  (this.props.userType === 'admin') ? 'general' : this.props.userType;
            filterData.filterKeys   =  this.state.filterKeys;
            //this.props.updateFilter();
         }
      }

      console.log('Filter Data : ', filterData); */
      
      let filterData	=	this.state.filterData;
      //let filterData	=	this.props.filterData.dashboard;
      let type       =  '';
      let filterKeys =  {};
      if(!isEmpty(filterData)) {
         type                          =  filterData.type;
         filterKeys                    =  filterData.filterKeys;
      }
      //console.log('Dashboard Render : ', type, filterKeys, filterData);
      return (
         <main className={`dash right_sec${(userType !== 'admin') ? ' noAdmin' : ''}`}>            
            {
               (!isEmpty(this.props.settingsData)) ? 
               <Filter
                  liveOrderCount       =  {this.state.liveOrderCount}
                  //type                 =  {this.state.type}
                  filterData           =  {filterData}
                  userType             =  {userType}
                  stores               =  {stores}
                  zones                =  {zones}
                  //handleTypeChange     =  {this.handleTypeChange}
                  //handleStateChange    =  {this.handleStateChange}
                  //handleAreaChange     =  {this.handleAreaChange}
                  //handleStoreChange    =  {this.handleStoreChange}
                  searchFilter         =  {this.searchFilter}
                  resetSearch          =  {this.props.resetSearch}
                  //handleRemoveFilter   =  {this.handleRemoveFilter}
                  //filterKeys           =  {this.state.filterKeys}
                  getLocations         =  {this.props.getLocations}
                  taskType             =  {taskType}
                  locations            =  {locations}
                  pharmacy             =  {pharmacy}
                  timings              =  {this.timings}
                  userData             =  {this.props.userData}
                  settingsData         =  {this.props.settingsData}
                  createTask           =  {this.props.createTask}
                  filteredList         =  {this.props.filteredList}
                  getTaskDetails       =  {this.props.getTaskDetails}
                  taskDetails          =  {this.props.taskDetails}
                  deleteTask           =  {this.props.deleteTask}
                  updateTaskStatus     =  {this.props.updateTaskStatus}
                  editTask             =  {this.props.editTask}
                  getTrackDetails      =  {this.props.getTrackDetails}
                  isTaskProcessing     =  {this.props.isTaskProcessing}
                  updateFilter         =  {this.updateFilter}
                  getShoppedLate       =  {this.getShoppedLate}
               /> : null
            }
            <div>
               {
                  (!isEmpty(filterData) && !isEmpty(this.props.settingsData)) ?                  
                     <DashboardList
                        updateTotalCount  =  {this.updateTotalCount}
                        type              =  {type}
                        org_id            =  {this.state.org_id}
                        statefilter       =  {filterKeys.State}
                        areafilter        =  {filterKeys.Area}
                        storefilter       =  {filterKeys.Store}
                        searchTxt         =  {this.state.searchTxt}
                        taskType          =  {taskType}
                        stores            =  {stores}
                        locations         =  {locations}
                        pharmacy          =  {pharmacy}
                        timings           =  {this.timings}
                        getTaskDetails    =  {this.props.getTaskDetails}
                        taskDetails       =  {this.props.taskDetails}
                        deleteTask        =  {this.props.deleteTask}
                        updateTaskStatus  =  {this.props.updateTaskStatus}
                        editTask          =  {this.props.editTask}
                        settingsData      =  {this.props.settingsData}
                        getTrackDetails   =  {this.props.getTrackDetails}
                        shoppedLate       =  {this.props.shoppedLate}
                     /> : null
               }
            </div>
         </main>
      )
   }
}
export default withRouter(DashboardComponent);