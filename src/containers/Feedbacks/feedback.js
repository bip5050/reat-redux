import React from 'react';
import List from './list';
import lodash from 'lodash';
import moment from 'moment-timezone';
import { isEqual, isEmpty } from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import { PropTypes as PT } from 'prop-types';
import FeedbackFilter from './feedbackFilter';
import { withRouter } from 'react-router-dom';
import {setFilter, getFilter, clearFilter} from '../../Helper/common';

class FeedbackComponent extends React.Component {
	static propTypes = {
		reply: PT.func,
		isLoading: PT.bool,
		isFiltering: PT.bool,
		isSearching: PT.bool,
		getFeedback: PT.func,
		getSummary: PT.func,
		getLocations: PT.func,
		locations: PT.object,
		feedbackData: PT.array,
		feedBackCount: PT.number,
		feedbackSearch: PT.func,
		isReplying: PT.bool,
		replyResult: PT.object,
		feedbackSummeryData: PT.object
	};

	static defaultProps = {
		feedbackData: [],
		feedBackCount: 0,
		replyResult: {},
		searchResultList:  [],
		feedbackSummeryData:  {}
	};

	constructor(props) {
		super(props);
		/* let filter = getFilter('FeedBack');
		let endDate = moment().format('YYYY-MM-DD');
		let startDate = moment().subtract(1, 'days').format('YYYY-MM-DD'); */

		this.state = {	
			sOpen: false,
			aOpen: false,
			stOpen: false,	
			//type: (filter && filter.type)?filter.type:'general',
			allRatings: true, 
			//endDate: endDate,
          	filterByStart: [], 
          	advSearchData: {},
			showSearch: false,		
		 	//selectedState: null,
		 	//selectedArea: null,
          	//selectedStore: null,
			//startDate: startDate,
			filteredFeedbackData: [],
			//filterKeys: !isEmpty(filter)?filter.filterKeys:{ State:[], Area: [], Store: [] },
			//noofdays: ''
		}; 

		this.searchFilter = this.searchFilter.bind(this);
	  	//this.handleTypeChange = this.handleTypeChange.bind(this);
	};

	/* handleTypeChange(type) {
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj};
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};

		makeFeedbackFilterObj.page = 1;
		this.setState({ 
			type: type, 
			allRatings: true, 
			filterByStart: [], 
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=>{
			this.updateFeedbackSummery();
			this.updateFeedbackList();

			if(!isEmpty(this.state.advSearchData)){
				this.props.feedbackSearch({ ...this.state.advSearchData, user_type: type });
			}
		});

      	setFilter('FeedBack', { makeFeedbackFilterObj: makeFeedbackFilterObj, makeSummeryFilterObj: makeSummeryFilterObj, user_type:this.props.userType, type: type, filterKeys: this.state.filterKeys || {}});
	}; */

	searchFilter (searchData) {
		this.setState({ advSearchData: searchData }, ()=> {
			//this.props.feedbackSearch({ ...searchData, user_type: this.state.type });
			this.props.feedbackSearch({ ...searchData });
		});
   	};

	handleCheckboxFilter(event, type){
		event.persist();

		if(event.target.checked && (event.target.value === "all")){
			this.setState({ allRatings: true, filterByStart: [], filteredFeedbackData: this.props.feedbackData});
		} else {
			this.setState({ allRatings: false });

			if(event.target.value !== "all") {	
				let filterByStart = this.state.filterByStart || {};
				let selIndex = filterByStart.findIndex((item) => {
					return item === event.target.value;
				});

				if(selIndex === -1) {
					filterByStart.push(event.target.value);
				} else {
					filterByStart.splice(selIndex, 1);
				}

				this.setState({ filterByStart: filterByStart }, ()=> {
					let sortedArray = lodash.filter((this.props.feedbackData)?this.props.feedbackData:[], (v) => lodash.includes(filterByStart, v.rating));	

					this.setState({ filteredFeedbackData: sortedArray });
				});	
			} else {	
				this.setState({ filterByStart: [], filteredFeedbackData: this.props.feedbackData});
			}
		}

		if(this.state.filterByStart.length === 0){
			this.setState({ allRatings: true, filterByStart: [], filteredFeedbackData: []}, ()=> {
				this.setState({ filteredFeedbackData: this.props.feedbackData });				
			});
		}		
	};

	changePage(data){
		const { currentPage } =	data;
		let savedFilterData			=	{...this.props.savedFilterData};
		let makeFeedbackFilterObj	=	savedFilterData.makeFeedbackFilterObj;
		//console.log('Api Data From Change Page : ', makeFeedbackFilterObj.page, currentPage, makeFeedbackFilterObj.page !== currentPage);
		if(makeFeedbackFilterObj.page !== currentPage) {
			makeFeedbackFilterObj.page = currentPage;
			let data	=	{
				...makeFeedbackFilterObj,
				filter: savedFilterData
			}
			this.props.getFeedback(data);
		}
		/* this.setState({ makeFeedbackFilterObj: makeFeedbackFilterObj, allRatings: true, filterByStart: []  }, ()=> {
			this.updateFeedbackList();
		}); */
	};

	componentWillReceiveProps(props) {
		//console.log(props.locations)
		/* if(!!props.userType && !isEqual(this.props.userType, props.userType)) {
		 	let filterKeys = this.state.filterKeys;
			let type = (props.userType === 'admin') ? 'general' : props.userType;

			if(!!props.userType){
				let filter = getFilter('FeedBack');
				if(!isEmpty(filter) && filter.user_type === props.userType) {
					type       = filter.type;
					filterKeys = filter.filterKeys;
				} else {
					clearFilter('FeedBack');
				}
			};

			this.setState({ type: type, filterKeys: filterKeys });
		};

		this.setState({ filteredFeedbackData: props.feedbackData, feedBackCount: props.feedBackCount }); */
		this.setState({ filteredFeedbackData: props.feedbackData, feedBackCount: props.feedBackCount });
	};

	componentWillMount() {		
		this.props.getLocations();
	}

	componentDidMount(){
		//this.props.getLocations();
	 	/* let filterKeys = this.state.filterKeys;
		let type = (this.props.userType === 'admin') ? 'general' : this.props.userType;

		if(!!this.props.userType){
			let filter = getFilter('FeedBack');
			if(!isEmpty(filter) && filter.user_type === this.props.userType) {
				type        =  filter.type;
				filterKeys  =  filter.filterKeys;
			} else {
				clearFilter('FeedBack');
			}
		};

		this.setState({ filteredFeedbackData: this.props.feedbackData, feedBackCount: this.props.feedBackCount, type: type, filterKeys: filterKeys });

		this.updateFeedbackSummery();
		this.updateFeedbackList(); */
		//this.setState({ filteredFeedbackData: props.feedbackData, feedBackCount: props.feedBackCount });
	};

	render() {
		const { type, makeFilterObj, filterKeys, startDate, endDate, noofdays, allRatings, filterByStart, filteredFeedbackData, feedBackCount } = this.state;
	 	let locationData = this.props.locations || {};
	 	let stores = locationData.stores || [];
		let zones = locationData.zones || {};
		let userType = this.props.userType || {};
		let settingsData = this.props.settingsData || {};
		//console.log('Filter Loaded : ', this.props.isFilterLoaded && !isEmpty(this.props.locations));
		return (
			<main className={`dash right_sec feedP${(userType !== 'admin') ? ' noAdmin' : ''}`}>
				{
					(this.props.isFilterLoaded && !isEmpty(this.props.locations)) ? 
					<FeedbackFilter 
						userType={this.props.userType}
						//type={type}
						area={zones}
						stores={stores}
						//endDate={endDate}
						//startDate={startDate}
						//noofdays={noofdays}
						//filterKeys={filterKeys} 
						reply={this.props.reply}
						feedBackCount={feedBackCount}
						searchFilter={this.searchFilter}
						isReplying={this.props.isReplying}
						replyResult={this.props.replyResult}
						isSearching={this.props.isSearching} 
						filteredList={this.props.filteredList}
						getFeedback={this.props.getFeedback} 
						getSummary={this.props.getSummary} 
						savedFilterData={this.props.savedFilterData}
						/* handleTypeChange={this.handleTypeChange}				
						onDateRange = {this.onDateRange.bind(this)}	
						onSelectEndDate = {this.onSelectEndDate.bind(this)} */
						searchResultList={this.props.searchResultList || []} 
						/* handleAreaChange = {this.handleAreaChange.bind(this)}				
						handleStateChange = {this.handleStateChange.bind(this)}
						handleStoreChange = {this.handleStoreChange.bind(this)}
						onSelectStartDate = {this.onSelectStartDate.bind(this)}	
						handleRemoveFilter = {this.handleRemoveFilter.bind(this)} */
					/> : null
				}
				

	            <List 
	            	type={type}
	            	endDate={endDate}
					startDate={startDate}
					allRatings={allRatings}
					reply={this.props.reply}
					filterByStart={filterByStart}		            
		            feedBackCount={feedBackCount}		
		            isLoading={this.props.isLoading} 
					isReplying={this.props.isReplying}
					replyResult={this.props.replyResult}
		            isFiltering={this.props.isFiltering}   
					changePage = {this.changePage.bind(this)}         
		            filteredFeedbackData={filteredFeedbackData || []} 
		            feedbackSummeryData={this.props.feedbackSummeryData || {}} 
					handleCheckboxFilter = {this.handleCheckboxFilter.bind(this)}
	            />  
			</main>
		);
	};
};

export default withRouter(FeedbackComponent);