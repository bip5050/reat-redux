import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {isEmpty} from 'lodash';
import Filter from './filter';
import TaskList from './taskList';
import { isEqual } from 'lodash';
import moment from 'moment-timezone';
import {getFilter, clearFilter, setFilter} from '../../Helper/common';

class TaskHistory extends Component {
   static propTypes  =  {
      userData       :  PT.object,
      isFetching     :  PT.bool,
      isProcessing   :  PT.bool,
      isError        :  PT.bool,
      isSuccess      :  PT.bool,
      history        :  PT.object,
      getHistory     :  PT.func,
      exportTaskCsv  :  PT.func,
      isTaskCsvExporting: PT.bool
   }

   static defaultProps     =  {
      userData       :  {},
      isFetching     :  false,
      isProcessing   :  false,
      isError        :  false,
      isSuccess      :  false,
      history        :  {},
      getHistory     :  () => { },
      exportTaskCsv  :  () => { },
      isTaskCsvExporting :  false
   }

   constructor(props) {
      super(props);
      this.state                    =  {
               org_id         :  (!!this.props.userData) ? this.props.userData.org_id : '',
               selectedState  :  null,
               selectedArea   :  null,
               selectedStore  :  null,
               filterKeys     :  {State:[], Area: [], Store: []},
               type           :  'general',
               searchTxt      :  '',
               sOpen          :  false,
               selOrder       :  {},
               filterData     :  {}
            }
      this.timings                  =  [];
      //this.handleTypeChange         =  this.handleTypeChange.bind(this);
      this.searchFilter             =  this.searchFilter.bind(this);
   }

   /* handleTypeChange(type, selFilterData) {
      this.setState({
         type        :  type
      }, () => {
         let filterData                =  {...this.state.filterData};
         filterData.type               =  type;
         filterData.pageno             =  1;
         this.getHistory(filterData, selFilterData);
      })
   } */

   searchFilter (searchData) {
      this.props.search({
         ...searchData,
         user_type: this.state.type,
         dateType: 'range'
      })
   }
   
   componentWillReceiveProps(props) {
      // && !isEqual(this.props.userType, props.userType)
      /* if(!!props.userType) {   
         let type       =  (props.userType === 'admin') ? 'general' : props.userType;
         let filter		=	props.filterData.history || {};
			if(!isEmpty(filter) && filter.user_type === this.props.userType) {
				type        =  filter.type;
			}
         this.setState({
            type: type
         })
      } */
   }

   /* componentWillMount(){      
      this.props.getSettings();
   } */

   componentDidMount() {
      this.props.getLocations();      
      /* if(!!this.props.userType) {
         let filter		=	this.props.filterData.history || {};
         let type       =  (this.props.userType === 'admin') ? 'general' : this.props.userType;
			if(!isEmpty(filter) && filter.user_type === this.props.userType) {
				type        =  filter.type;
			}
         this.setState({
            type: type
         })
      } */
   }
   
   /* componentWillReceiveProps(props){      
      console.log('Check Processing : ', this.props.isEditTaskProcessing != props.isEditTaskProcessing && !props.isEditTaskProcessing && !!this.props.isEditTaskProcessing)
      if(this.props.isEditTaskProcessing != props.isEditTaskProcessing && !props.isEditTaskProcessing && !!this.props.isEditTaskProcessing) {
         console.log('isEditTaskProcessing : ', this.props.isEditTaskProcessing);
         console.log('Filter Data : ', this.props.filterData);
         this.getHistory(this.state.filterData, this.props.filterData);
      }
   } */

   getHistory = (data, selFilterData) => {
      this.setState({
         filterData  :  {...data}
      }, () => {
         data.filter		=	{key: 'history', value: JSON.stringify(selFilterData)};
         //console.log('Data : ', data);
         this.props.getHistory(data);
      })
   }

   render() {
      let locationData           =  this.props.locations || {};
      let pharmacy               =  (!!locationData.pharmacy) ? locationData.pharmacy : false;
      let stores                 =  locationData.stores || [];
      let locations              =  locationData.locations || [];
      let taskType               =  locationData.taskType || '';
      let zones                  =  locationData.zones || {};
      let userType               =  this.props.userType || '';
      let filterData             =	this.props.filterData.history || {};
      return (
         <main className={`dash right_sec taskp ${(userType !== 'admin') ? ' noAdmin' : ''}`}>
            {
               (this.props.isFilterLoaded) ? 
               <Filter
                  //handleTypeChange     =  {this.handleTypeChange}
                  getHistory           =  {this.getHistory}
                  taskHistory          =  {this.props.taskHistory}
                  //type                 =  {this.state.type}
                  stores               =  {stores}
                  zones                =  {zones}
                  handleStateChange    =  {this.handleStateChange}
                  handleAreaChange     =  {this.handleAreaChange}
                  handleStoreChange    =  {this.handleStoreChange}
                  searchFilter         =  {this.searchFilter}
                  resetSearch          =  {this.props.resetSearch}
                  handleRemoveFilter   =  {this.handleRemoveFilter}
                  getLocations         =  {this.props.getLocations}
                  taskType             =  {taskType}
                  locations            =  {locations}
                  pharmacy             =  {pharmacy}
                  timings              =  {this.timings}
                  filterData           =  {this.state.filterData}
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
                  exportTaskCsv        =  {this.props.exportTaskCsv}
                  csvUrl               =  {this.props.csvUrl}
                  isTaskCsvExporting   =  {this.props.isTaskCsvExporting}
                  userType             =  {userType}
						savedFilterData      =  {filterData}
               /> : null
            }
            {
               (!isEmpty(this.state.filterData)) ? 
               <TaskList
                  getHistory        =  {this.getHistory}
                  taskHistory       =  {this.props.taskHistory}
                  type              =  {this.state.type}
                  org_id            =  {this.state.org_id}
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
                  filterData        =  {this.state.filterData}
                  isProcessing      =  {this.props.isProcessing}
                  savedFilterData   =  {this.props.filterData}
               />: <div className="loader">Loading....</div>
            }
         </main>
      )
   }
}
export default withRouter(TaskHistory);