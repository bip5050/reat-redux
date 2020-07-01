import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {PropTypes as PT} from 'prop-types';
import * as actions from './actions';
import DashboardComponent from './dashboard';

const Dashboard   = ({
                        userData,
                        getLocations,
                        locations,
                        settingsData,
                        userType,
                        createTask,
                        getTaskDetails,
                        taskDetails,
                        deleteTask,
                        editTask,
                        updateTaskStatus,
                        getTrackDetails,
                        search,
                        resetSearch,
                        filteredList,
                        isTaskProcessing,
                        updateFilter,
                        filterData,
                        isFilterLoaded,
                        getShoppedLate,
                        shoppedLate
    }) => {
    return (
      <DashboardComponent
        userData={userData}
        getLocations={getLocations}
        locations={locations}
        settingsData={settingsData}
        userType={userType}
        createTask={createTask}
        getTaskDetails={getTaskDetails}
        taskDetails={taskDetails}
        deleteTask={deleteTask}
        editTask={editTask}
        updateTaskStatus={updateTaskStatus}
        getTrackDetails={getTrackDetails}
        search={search}
        resetSearch={resetSearch}
        filteredList={filteredList}
        isTaskProcessing={isTaskProcessing}
        updateFilter={updateFilter}
        filterData={filterData}
        isFilterLoaded={isFilterLoaded}
        getShoppedLate={getShoppedLate}
        shoppedLate={shoppedLate}
      />
    )
 };

 Dashboard.propTypes   = {
  userData: PT.object,
  getLocations: PT.func,
  createTask: PT.func,
  getTaskDetails: PT.func,
  getTrackDetails: PT.func,
  deleteTask: PT.func,
  editTask: PT.func,
  updateTaskStatus: PT.func,
  search: PT.func,
  resetSearch: PT.func,
  locations: PT.object,
  taskDetails: PT.object,
  settingsData: PT.object,
  userType: PT.string,
  isTaskProcessing: PT.bool,
  updateFilter: PT.func,
	filterData: PT.object,
	isFilterLoaded: PT.bool,
  getShoppedLate: PT.func,
	shoppedLate: PT.object,
 }

 const  mapStateToProps   = ({dashboardReducer, headerReducer}, ownProps) => {
    //console.log('Header Reducer : ', headerReducer.filterData);
    return ({
            userData: ownProps.userData,
            isTaskProcessing: dashboardReducer.isTaskProcessing,
            locations: dashboardReducer.locations,
            userType: headerReducer.userType,
            settingsData: headerReducer.settingsData,
            taskDetails: dashboardReducer.taskDetails,
            filteredList: dashboardReducer.filteredList,
            filterData: headerReducer.filterData,
            isFilterLoaded: headerReducer.isFilterLoaded,
            shoppedLate: dashboardReducer.shoppedLate
        })
    }


const mapDispatchToProps = dispatch => ({
  updateFilter: (data) => dispatch(actions.updateFilter(data)),
  updateTaskStatus: (data) => dispatch(actions.updateTaskStatus(data)),
  deleteTask: (data) => dispatch(actions.deleteTask(data)),
  getLocations: (data) => dispatch(actions.getLocations(data)),
  createTask: (data) => dispatch(actions.createTask(data)),
  editTask: (data) => dispatch(actions.editTask(data)),
  getTaskDetails: (data) => dispatch(actions.getTaskDetails(data)),
  getTrackDetails: (data) => dispatch(actions.getTrackDetails(data)),
  search: (data) => dispatch(actions.search(data)),
  resetSearch: (data) => dispatch(actions.resetSearch(data)),
  getShoppedLate: (data) => dispatch(actions.getShoppedLate(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));