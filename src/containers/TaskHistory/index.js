import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {PropTypes as PT} from 'prop-types';
import * as actions from './actions';
import * as dashboardActions from '../Dashboard/actions';
import * as headerActions from '../Header/actions';
import TaskHistory from './taskHistory';

const TaskHistoryContainer = ({
  userData,
  getLocations,
  locations,
  settingsData,
  userType,
  isProcessing,
  isError,
  isSuccess,
  getHistory,
  taskHistory,
  getTaskDetails,
  taskDetails,
  deleteTask,
  editTask,
  updateTaskStatus,
  getTrackDetails,
  search,
  resetSearch,
  filteredList,
  exportTaskCsv,
  csvUrl,
  isTaskCsvExporting,
	getSettings,
  filterData,
  isFilterLoaded,
  isEditTaskProcessing
}) => {
  return (
    <TaskHistory
      userData          = {userData}
      getLocations      = {getLocations}
      locations         = {locations}
      settingsData      = {settingsData}
      userType          = {userType}
      isProcessing      = {isProcessing}
      isError           = {isError}
      isSuccess         = {isSuccess}
      getHistory        = {getHistory}
      taskHistory       = {taskHistory}
      getTaskDetails    = {getTaskDetails}
      taskDetails       = {taskDetails}
      deleteTask        = {deleteTask}
      editTask          = {editTask}
      updateTaskStatus  = {updateTaskStatus}
      getTrackDetails   = {getTrackDetails}
      search            = {search}
      resetSearch       = {resetSearch}
      filteredList      = {filteredList}
      exportTaskCsv     = {exportTaskCsv}
      csvUrl            = {csvUrl}
      isTaskCsvExporting= {isTaskCsvExporting}
			getSettings       = {getSettings}
			filterData        = {filterData}
			isFilterLoaded    = {isFilterLoaded}
			isEditTaskProcessing    = {isEditTaskProcessing}
    />
  )
};

 TaskHistoryContainer.propTypes   = {
  userData          : PT.object,
  getLocations      : PT.func,
  locations         : PT.object,
  isProcessing      : PT.bool,
  isError           : PT.bool,
  isSuccess         : PT.bool,
  getHistory        : PT.func,
  settingsData      : PT.object,
  userType          : PT.string,
  taskHistory       : PT.object,
  getTaskDetails    : PT.func,
  getTrackDetails   : PT.func,
  deleteTask        : PT.func,
  editTask          : PT.func,
  updateTaskStatus  : PT.func,
  search            : PT.func,
  resetSearch       : PT.func,
  exportTaskCsv     : PT.func,
  csvUrl            : PT.object,
  isTaskCsvExporting : PT.bool,
	getSettings       : PT.func,
  filterData        : PT.object,
  isFilterLoaded    : PT.bool,
  isEditTaskProcessing    : PT.bool
 }

  const  mapStateToProps   = ({dashboardReducer, taskHistoryReducer, headerReducer}, ownProps) => {
    return ({
      userData      : ownProps.userData,
      userType      : headerReducer.userType,
      locations     : dashboardReducer.locations,
      settingsData  : headerReducer.settingsData,
      isProcessing  : taskHistoryReducer.isProcessing,
      isError       : taskHistoryReducer.isError,
      isSuccess     : taskHistoryReducer.isSuccess,
      taskHistory   : taskHistoryReducer.taskHistory,
      taskDetails   : dashboardReducer.taskDetails,
      filteredList  : dashboardReducer.filteredList,
      csvUrl        : taskHistoryReducer.csvUrl,
      isTaskCsvExporting : taskHistoryReducer.isTaskCsvExporting,
      filterData    : headerReducer.filterData,
      isFilterLoaded    : headerReducer.isFilterLoaded,
      isEditTaskProcessing    : dashboardReducer.isEditTaskProcessing
    })
  }


const mapDispatchToProps  = dispatch => ({
  updateTaskStatus    : (data) => dispatch(dashboardActions.updateTaskStatus(data)),
  deleteTask          : (data) => dispatch(dashboardActions.deleteTask(data)),
  getLocations        : (data) => dispatch(dashboardActions.getLocations(data)),
  editTask            : (data) => dispatch(dashboardActions.editTask(data)),
  getTaskDetails      : (data) => dispatch(dashboardActions.getTaskDetails(data)),
  getTrackDetails     : (data) => dispatch(dashboardActions.getTrackDetails(data)),
  search              : (data) => dispatch(dashboardActions.search(data)),
  resetSearch         : (data) => dispatch(dashboardActions.resetSearch(data)),
  getSettings         : (data) => dispatch(headerActions.getSettings(data)),
  getHistory          : (data) => dispatch(actions.getHistory(data)),
  exportTaskCsv       : (data) => dispatch(actions.exportTaskCsv(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TaskHistoryContainer));