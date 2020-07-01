import React from 'react';
import lodash from 'lodash';
import Filter from './filter';
import ReportGrid from './reportGrid';
import moment from 'moment-timezone';
import { isEqual, isEmpty } from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import { PropTypes as PT } from 'prop-types';
import { withRouter } from 'react-router-dom';

class ReportComponent extends React.Component {
	static propTypes = {
		isLoading: PT.bool,
		getReport: PT.func,
		userType: PT.string,
		getLocations: PT.func,
		settingsData: PT.object
	};

	static defaultProps = {
		isLoading: false,
		getReport: () => { },
		getLocations: () => { },
		settingsData: () => { }
	};

	constructor(props) {
		super(props);

		this.state = {	
			type:'general',			
	 	 	/* filterData: {
	 	 		type: 'date'
			  }, */
			filterData: {show_by: 'date'},
         	endDate:  moment().format('YYYY-MM-DD'),
			startDate:  moment().subtract(1, 'months').format('YYYY-MM-DD')
		};

		//this.handleTypeChange = this.handleTypeChange.bind(this);
	};

	/* handleTypeChange(type, filterData) {
		this.setState({ type: type }, () => {
			let data = {...this.state.filterData};
			data.user_type = type;
			//console.log(filterData);
			this.getReport(data, filterData);
      	});
	}; */

	componentWillReceiveProps(props) {
		/* if(!!props.userType) {
			let type       	=	(props.userType === 'admin') ? 'general' : props.userType;
			let filter		=	props.filterData.reports || {};
			if(!isEmpty(filter) && filter.user_type === this.props.userType) {
				this.setState({
				   type        :  filter.type
				})
			} else {
				//clearFilter('history');
				this.setState({
					type: type
				})
			}
		}; */
	};

	componentDidMount(){
		this.props.getLocations();
	};

	/* componentWillMount() {
		this.props.getSettings();
	}; */

	getReport = (data, selFilterData) => {
		let filterData = {...this.state.filterData};
		let searchData	=	{
			...data,
			show_by: filterData.show_by
		};
		//console.log('!!!!!!!!!!!!', searchData);

		this.setState({
			filterData: searchData
		}, () => {
			searchData.filter		=	{key: 'reports', value: JSON.stringify(selFilterData)};
			this.props.getReport(searchData);
		});
   	};
	
	getOrder = (showBy) => {
		let filterData = {...this.state.filterData};
		filterData.show_by = showBy;
		this.setState({
			filterData: {...filterData}
		}, () => {
			this.props.getOrder(filterData);
		});
		//console.log('showBy : ', showBy);
	}

	getLateOrders = () => {
		let filterData = {...this.state.filterData};
		delete filterData.show_by;		
		filterData.filter		=	this.props.filterData.reports;
		filterData.page			=	1;
		filterData.order_by		=	'complete_after';
		filterData.format		=	'desc';
		//console.log(filterData);		
		this.props.getLateOrders(filterData);
	}

	pageChangeLateOrders = (srchData) => {
		let filterData = {...this.state.filterData};
		delete filterData.show_by;		
		filterData.filter		=	this.props.filterData.reports;
		//filterData.page			=	(!!page)? page : 1;
		let data		=	{
			...filterData,
			...srchData
		}
		//filterData.order_by		=	'time_diff';
		//console.log(filterData);		
		this.props.getLateOrders(data);
	}

	sortLateOrders = (sortBy) => {
		let filterData = {...this.state.filterData};
		delete filterData.show_by;
		filterData.filter		=	this.props.filterData.reports;
		//console.log(this.props.unsortedLateOrders, this.props.lateOrder.count);
		let data		=	{
			searchData: {
				...filterData,
				...sortBy
			},
			unsortedLateOrders : this.props.unsortedLateOrders,
			count : this.props.lateOrder.count
		}
		//console.log(filterData);		
		this.props.sortLateOrders(data);
	}

	render() {
		const { startDate, endDate } = this.state;
		let userType = this.props.userType || {};
		let locationData = this.props.locations || {};

		let zones = locationData.zones || {};
		let stores = locationData.stores || [];
		let taskType = locationData.taskType || '';
		let locations = locationData.locations || [];
		let filterData	=	this.props.filterData.reports || {};
		//console.log('PRops : ', this.props.isFilterLoaded, this.props.showReport);
		return (
			(this.props.isFilterLoaded)? 
				(!!this.props.showReport && this.props.showReport === 'true')?
				<main className={`dash right_sec statsp ${(userType !== 'admin') ? ' noAdmin' : ''}`}>
					{
						(!!filterData) ?
						<Filter 
							//type={type}
							zones={zones}
							stores={stores}
							taskType={taskType}
							locations={locations}
							getReport={this.getReport}
							handleTypeChange={this.handleTypeChange} 
							userType={this.props.userType}
							filterData={filterData}
						/> : null
					}
					{
					(!!!this.props.isLoading)?
						<ReportGrid
							startDate={startDate}
							endDate={endDate}
							reportData={this.props.reportData}
							getOrder={this.getOrder}
							showBy={this.state.filterData.show_by}
							isOrderLoading={this.props.isOrderLoading}
							isLateOrderLoading={this.props.isLateOrderLoading}
							getLateOrders={this.getLateOrders}
							lateOrder={this.props.lateOrder}
							getTaskDetails={this.props.getTaskDetails}
							taskDetails={this.props.taskDetails}
							sortLateOrders={this.sortLateOrders}
							pageChangeLateOrders={this.pageChangeLateOrders}
						/>
						: 
						<div className="loader">Loading....</div>
					}
				</main> : <main className={`dash right_sec statsp deniedp`}><div className="aDenied">Access Denied</div></main>
			: <main className={`dash right_sec statsp`}>
				<div className="loader">Loading....</div>
			</main>
		);
	};
};

export default withRouter(ReportComponent);