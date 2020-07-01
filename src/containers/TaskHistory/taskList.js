import React, {Component} from 'react';
import { getStatusClass } from '../../util/helper';
import { isEmpty, isEqual, map as _map } from 'lodash';
import CustomContext from '../Modals/contextMenu';
import EditTask from '../Modals/editTaskModal';
import TaskDetails from '../Modals/taskDetailsModal';
import MapDetails from '../Modals/mapDetailsModal';
import TrackDetails from '../Modals/trackDetailsModal';
import Pagination from '../../Helper/pagination';
import StateWiseList from './stateWiseList';
import ZoneWiseList from './zoneWiseList';
import UncategorizedList from './uncategorizedList';

export default class TaskList extends Component {
   constructor(props) {
      super(props);
      this.state                  =   {
                                          editShow          :   false,
                                          detailsShow       :   false,
                                          mapShow           :   false,
                                          trackShow         :   false,
                                          visible           :   false,
                                          x                 :   '',
                                          y                 :   '',
                                          tasks             :   {},
                                          isLoading         :   true,
                                          mrchnt_address    :   '',
                                          recpnt_address    :   '',
                                          filteredList      :   [],
                                          //totalRecords      :  0,
                                          //itemsPerPage      :  100
                                      };
      this.handleContextMenu      =   this.handleContextMenu.bind(this);
      this.openEditWindow         =   this.openEditWindow.bind(this);
      this.openDetailsWindow      =   this.openDetailsWindow.bind(this);
      this.openMapWindow          =   this.openMapWindow.bind(this);
      this.openTrackWindow        =   this.openTrackWindow.bind(this);
      this.deleteTask             =   this.deleteTask.bind(this);
      this.updateTask             =   this.updateTask.bind(this);
      this.handleClose            =   this.handleClose.bind(this);
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
         visible     :  false,
         x:0,
         y:0
      });
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

   /* componentWillReceiveProps(props) {
      if(!isEmpty(props)){
         this.setState()
      }
   } */

   /* shouldComponentUpdate(props){
      console.log(!isEqual(props.filterData, this.props.filterData), this.props isEmpty(this.props.filterData));
      if(isEmpty(this.props.filterData) || !isEqual(props.filterData, this.props.filterData)){
         return true;
      } else {
         return false;
      }
      //return true;
   } */

   changePage = (data) => {
      //console.log('Current Page : ', this.props.filterData);
      const { currentPage }	=	data;
      //console.log('Current Page : ', currentPage, this.props.filterData, this.props.filterData.pageno);
		//const offset									=	(currentPage - 1) * pageLimit;
      //const limit										=	(offset + pageLimit);
      let filterData          =  {...this.props.filterData};
      filterData.pageno       =  currentPage;
      if(currentPage !== this.props.filterData.pageno)
         this.props.getHistory(filterData, this.props.savedFilterData);
      /* this.setState({currentPage:currentPage}, function(){         
         if(this.state.searchText !== '')
            this.props.getCustomerList({searchType:this.state.searchType, searchText:this.state.searchText, currentPage:this.state.currentPage});
      }); */
   }

   render() {
      //console.log('Task History List : ', this.props.isProcessing);
      let taskHistory         =   this.props.taskHistory || {};
      let taskList            =   {};
      let taskCount           =   0;
      let listType            =  '';
      if (!isEmpty(taskHistory)) {
         taskList             =   taskHistory.tasks || {};
         taskCount            =   taskHistory.task_count || 0;
         listType             =  taskHistory.list_type;
      }
      let itemsPerPage            =  500;
      let totalRecords            =  taskCount;
      //console.log(this.props.taskHistory, listType);
      //console.log(taskList.length > 0, taskList);
      return (
         (!isEmpty(this.props.taskHistory)) ? 
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
               (!isEmpty(taskList)) ? 
               <section className="content" style={{minHeight:'400px'}}>
                  {
                     //(taskList.length > 0) ? 
                     (listType === 'date') ?
                     <UncategorizedList
                        taskList             =  {taskList}
                        handleContextMenu    =  {this.handleContextMenu}
                        openTrackWindow    =  {this.openTrackWindow}
                        isProcessing      =  {this.props.isProcessing}
                     /> : null
                  }
                  {
                     (listType === 'state') ?
                     <StateWiseList
                        taskList             =  {taskList}
                        handleContextMenu    =  {this.handleContextMenu}
                        openTrackWindow    =  {this.openTrackWindow}
                        isProcessing      =  {this.props.isProcessing}
                     /> : null
                  }
                  {
                     (listType === 'zone') ?
                     <ZoneWiseList
                        taskList             =  {taskList}
                        handleContextMenu    =  {this.handleContextMenu}
                        openTrackWindow    =  {this.openTrackWindow}
                        isProcessing      =  {this.props.isProcessing}
                     /> : null
                  }
                  {
                     (listType === 'store-id') ?
                     <ZoneWiseList
                        taskList             =  {taskList}
                        handleContextMenu    =  {this.handleContextMenu}
                        openTrackWindow    =  {this.openTrackWindow}
                        isProcessing      =  {this.props.isProcessing}
                     /> : null
                  }
                  {
							totalRecords >= itemsPerPage ?
                     <div className="pagination_Pan"><Pagination totalRecords={totalRecords} pageLimit={itemsPerPage} pageNeighbours={1} onPageChanged={this.changePage} isProcessing={this.props.isProcessing}/></div>:null
                  }
               </section>
               : <section className="content"><div className="no-records">No Records</div></section>
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
         </div>
         : <div className="loader">Loading....</div>
      )
   }
}