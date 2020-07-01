import React from 'react';
import * as actions from './actions';
import ReportComponent from './report';
import { connect } from 'react-redux';
import {PropTypes as PT} from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as dashboardActions from '../Dashboard/actions';
import * as headerActions from '../Header/actions';

const Report   = ({
	userType,
	isLoading,
	isOrderLoading,
	locations,
	getReport,
	getOrder,
	reportData,
	settingsData,
	getLocations,
	showReport,
	isLateOrderLoading,
	getLateOrders,
	lateOrder,
	unsortedLateOrders,
	sortLateOrders,
	//getSettings,
	filterData,
	isFilterLoaded,
	taskDetails,
	getTaskDetails
}) => {
	return (
		<ReportComponent
			isLoading={isLoading}
			isOrderLoading={isOrderLoading}
			userType={userType}
			getReport={getReport}
			getOrder={getOrder}
			getLocations={getLocations}
			reportData={reportData}
			locations={locations}
			settingsData={settingsData}
			showReport={showReport}
			isLateOrderLoading={isLateOrderLoading}
			getLateOrders={getLateOrders}
			lateOrder={lateOrder}
			unsortedLateOrders={unsortedLateOrders}
			sortLateOrders={sortLateOrders}
			//getSettings={getSettings}
			filterData={filterData}
			isFilterLoaded={isFilterLoaded}
			taskDetails={taskDetails}
			getTaskDetails={getTaskDetails}
		/>
	)
};

Report.propTypes   = {
	isLoading: PT.bool,
	isOrderLoading: PT.bool,
	userType: PT.string,
	getLocations: PT.func,
	settingsData: PT.object,
	getReport: PT.func,
	getOrder: PT.func,
	showReport: PT.string,
	isLateOrderLoading: PT.bool,
	getLateOrders: PT.func,
	lateOrder: PT.object,
	unsortedLateOrders: PT.array,
	sortLateOrders: PT.func,
	//getSettings: PT.func,
	filterData: PT.object,
	isFilterLoaded: PT.bool,
	taskDetails: PT.object,
	getTaskDetails: PT.func
}

const mapReportToProps   = ({dashboardReducer, reportReducer, headerReducer}) => {
	//console.log('reportReducer', reportReducer.isLateOrderLoading);
	
	return ({
	 	userType: headerReducer.userType,
		isLoading: reportReducer.isLoading,
		isOrderLoading: reportReducer.isOrderLoading,
		reportData: reportReducer.reportData,
		locations: dashboardReducer.locations,
		settingsData: headerReducer.settingsData,
		showReport: headerReducer.showReport,
		isLateOrderLoading: reportReducer.isLateOrderLoading,
		lateOrder: reportReducer.lateOrder,
		unsortedLateOrders: reportReducer.unsortedLateOrders,
		filterData: headerReducer.filterData,
		isFilterLoaded: headerReducer.isFilterLoaded,
		taskDetails   : dashboardReducer.taskDetails
	});
};

const mapDispatchToProps = dispatch => ({
	getReport: (data) => dispatch(actions.getReport(data)),
	getOrder: (data) => dispatch(actions.getOrder(data)),
	getLocations: (data) => dispatch(dashboardActions.getLocations(data)),
	//getSettings: (data) => dispatch(headerActions.getSettings(data)),
	getLateOrders: (data) => dispatch(actions.getLateOrders(data)),
	sortLateOrders: (data) => dispatch(actions.sortLateOrders(data)),
	getTaskDetails      : (data) => dispatch(dashboardActions.getTaskDetails(data))
});

export default connect(mapReportToProps, mapDispatchToProps)(withRouter(Report));