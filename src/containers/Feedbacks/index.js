import React from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import {PropTypes as PT} from 'prop-types';
import FeedbackComponent from './feedback';
import { withRouter } from 'react-router-dom';
import * as headerActions from '../Header/actions';
import * as dashboardActions from '../Dashboard/actions';

const Feedback   = ({
	reply,
	isLoading,
	isReplying,
	replyResult,
	locations,
	userType,	
	settingsData,
	getSettings,
	getSummary,
	getFeedback,
	isFiltering,
	isSearching,
	getLocations,
	feedbackData,
	feedBackCount,
 	feedbackSearch,
 	savedFilterData,
	searchResultList,
	feedbackSummeryData,
	isFilterLoaded
}) => {
	return (
		<FeedbackComponent reply={reply} isReplying={isReplying} replyResult={replyResult} getSettings={getSettings} getSummary={getSummary} getFeedback={getFeedback} feedbackSearch={feedbackSearch} userType={userType} settingsData={settingsData} savedFilterData={savedFilterData} getLocations={getLocations} feedbackData={feedbackData} feedBackCount={feedBackCount} feedbackSummeryData={feedbackSummeryData} searchResultList={searchResultList} locations={locations} isLoading={isLoading} isFiltering={isFiltering} isSearching={isSearching} isFilterLoaded={isFilterLoaded}/>
	)
};

Feedback.propTypes   = {
	reply: PT.func,
 	userType: PT.string,
	isLoading: PT.bool,
	getSummary: PT.func,
	getSettings:PT.func,
	isFiltering: PT.bool,
	isSearching: PT.bool,
	settingsData: PT.object,
	getFeedback: PT.func,
	getLocations: PT.func,
	locations: PT.object,
	feedbackData: PT.array,
 	feedbackSearch: PT.func,
	feedBackCount: PT.number,
	searchResultList: PT.array,
	savedFilterData: PT.object,
	feedbackSummeryData: PT.object,
	isReplying: PT.bool,
	replyResult: PT.object,
	isFilterLoaded: PT.bool
}

const  mapStateToProps   = ({dashboardReducer, feedbackReducer, headerReducer}) => {
	let feedBackList = (feedbackReducer.feedbackData && feedbackReducer.feedbackData.rows)?feedbackReducer.feedbackData.rows:[];
	let searchResultList = (feedbackReducer.searchResultList && feedbackReducer.searchResultList.rows)?feedbackReducer.searchResultList.rows:[];
	let feedBackCount = (feedbackReducer.feedbackData && feedbackReducer.feedbackData.count)?feedbackReducer.feedbackData.count:0;
	// console.log(headerReducer, 'feedbackReducer', feedbackReducer);
	//console.log('dashboardReducer', dashboardReducer.locations);

	return ({
		feedbackData: feedBackList,
		feedBackCount: feedBackCount,
	 	userType: headerReducer.userType,
		searchResultList: searchResultList,
		isLoading: feedbackReducer.isLoading,	
		locations: dashboardReducer.locations,
		isFiltering: feedbackReducer.isFiltering,
		settingsData: headerReducer.settingsData,
		isSearching: feedbackReducer.isSearching,	
		isReplying: feedbackReducer.isReplying,
		replyResult: feedbackReducer.replyResult,
		feedbackSummeryData: feedbackReducer.feedbackSummeryData,
		savedFilterData: (headerReducer.filterData && headerReducer.filterData.feedback)?headerReducer.filterData.feedback:{},
		isFilterLoaded: headerReducer.isFilterLoaded
	});
};

const mapDispatchToProps = dispatch => ({
	reply: (data) => dispatch(actions.reply(data)),
	getSummary: (data) => dispatch(actions.getSummary(data)),
	getFeedback: (data) => dispatch(actions.getFeedback(data)),
 	feedbackSearch: (data) => dispatch(actions.feedbackSearch(data)),
	getSettings: (data) => dispatch(headerActions.getSettings(data)),
	getLocations: (data) => dispatch(dashboardActions.getLocations(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Feedback));