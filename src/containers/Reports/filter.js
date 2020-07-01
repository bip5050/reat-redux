import { Form } from 'reactstrap';
import moment from 'moment-timezone';
import {sortBy as _sortBy, isEmpty} from 'lodash';
import React, { Component } from 'react';
import AreaFilter from '../Filter/areaFilter';
import StateFilter from '../Filter/stateFilter';
import StoreFilter from '../Filter/storeFilter';
import {error as notifyerror} from '../../util/notify';
import Calendar from '../../components/Calendar/calendar';

class Filter extends Component {
	constructor(props) {
		super(props);
		this.tillDate	=  moment().format('YYYY-MM-DD');
		this.state = {
			sOpen: false,
			aOpen: false,
			stOpen: false,
		 	showFilter: false,
	 	 	showSearch: false,
	 	 	filterKeys: {State:[], Area: [], Store: []},
         	endDate:  moment().format('YYYY-MM-DD'),
	 	 	startDate:  moment().subtract(1, 'months').format('YYYY-MM-DD'),
		};

		this.toggleResFilter = this.toggleResFilter.bind(this);
	   	this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
	};

	toggleResFilter() {
		this.setState({
			showSearch:false,
			showFilter: !this.state.showFilter
		});
	};

	handleStateChange = (e, selectedState) => {
		e.stopPropagation();
		let filterKeys = this.state.filterKeys || {};
		let selIndex = filterKeys.State.findIndex((item) => {
			return item.value === selectedState.value;
		});

		if(selIndex === -1) {
			filterKeys.State.push({
				label:  selectedState.label,
				value:  selectedState.value
			})
		};

		filterKeys.State = _sortBy(filterKeys.State, 'value');
		this.setState({
			filterKeys: filterKeys
		}, () => {
			// this.props.getReport();
			this.handleUpdateFilter();
		});
	}

	handleAreaChange = (e, selectedArea) => {
		e.stopPropagation();
		let filterKeys = this.state.filterKeys || {};
		let selIndex = filterKeys.Area.findIndex((item) => {
			return item.value === selectedArea.delivery_zone_name;
		});

		if(selIndex === -1) {
			filterKeys.Area.push({
				id:  selectedArea.id,
				state:  selectedArea.state,
				value:  selectedArea.delivery_zone_name,
				label:  `${selectedArea.delivery_zone_name} (${selectedArea.state})`
			});
		};

		filterKeys.Area = _sortBy(filterKeys.Area, 'value');
		this.setState({
			filterKeys: filterKeys
		}, () => {
			this.handleUpdateFilter();
		});
	};

	handleStoreChange = (e, selectedStore) => {
		e.stopPropagation();
		let filterKeys = this.state.filterKeys || {}; 
		let selIndex = filterKeys.Store.findIndex((item) => {
			return item.value === selectedStore.label;
		});

		if(selIndex === -1) {
			filterKeys.Store.push({
				id: selectedStore.data.id,
				store_id:  selectedStore.data.store_id,
				label: selectedStore.label,
				value: selectedStore.label
			});
		};

		filterKeys.Store = _sortBy(filterKeys.Store, 'value');
		this.setState({
			filterKeys: filterKeys
		}, () => {
			this.handleUpdateFilter();
		});
	};

	handleRemoveFilter(e, type, index) {
		e.stopPropagation();
		let filters = this.state.filterKeys || [];
		filters[type].splice(index, 1);
		if(type === 'State' && filters[type].length === 0){
			filters.Area = [];
			filters.Store = [];
		};

		if(type === 'Area' && filters[type].length === 0){
			filters.Store = [];
		};

		let selectedState = (type !== 'State') ? this.state.selectedState : null;
		let selectedArea = (type !== 'Area') ? this.state.selectedArea : null;
		let selectedStore = (type !== 'Store') ? this.state.selectedStore : null;

		this.setState({
			filterKeys : filters,
			selectedArea: selectedArea,
			selectedState: selectedState,
			selectedStore: selectedStore
		}, () => {
			this.handleUpdateFilter();
		});
	};

	onSelectStartDate = (date) => {
		let startDate = moment(date).format('X');      
		let endDate = moment(this.state.endDate).format('X');
		if(startDate > endDate){
			notifyerror({message: 'Start date should be lower than end date'});
			return false;
		};

		let daysDiff	=	moment(this.state.endDate).diff(moment(date), 'days')
		if(daysDiff > 366) {
			notifyerror({message: 'Date range should not be greater than 1 year'});
			return false;
		};

		this.setState({
			startDate   :  date
		}, () => {
			this.handleUpdateFilter();
		})
	};

	onSelectEndDate = (date) => {
		let startDate = moment(this.state.startDate).format('X');      
		let endDate = moment(date).format('X');
		if(!!!this.state.startDate) {
			notifyerror({message: 'Please select start date first'});
			return false;
		};		
		
		let daysDiff	=	moment(date).diff(this.state.startDate, 'days');
		if(daysDiff > 366) {
			notifyerror({message: 'Date range should not be greater than 1 year'});
			return false;
		};

		if(endDate < startDate){
			notifyerror({message: 'End date should be greater than start date'});
			return false;
		};

		this.setState({
			endDate:  date
		}, () => {         
			this.handleUpdateFilter();
		});
	};

	onDateRange = (date) => {		
		let daysDiff	=	moment(date.endDate).diff(moment(date.startDate), 'days')
		if(daysDiff > 365) {
			notifyerror({message: 'Date range should not be greater than 1 year'});
			return false;
		};

		this.setState({
			startDate: date.startDate,
			endDate: date.endDate
		}, () => {         
			this.handleUpdateFilter();
		});
	};

	handleUpdateFilter() {
		let filterKeys =  this.state.filterKeys || {};
		let value_one        	=	'';
		let value_two        	=	'';
		let storeName        	=	{};
		let data				=	{}
  
		if(filterKeys.Store.length === 0 && filterKeys.Area.length === 0 && filterKeys.State.length > 0) {
		   	let states           =  (filterKeys.State || []).map(item => {
			   return {state: item.value, zone_id: []};
			});
			if(states.length > 0){
					data			=	{
						type		:	'place',
						place		:	states
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
				storeName[item.store_id]   = item.label;
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
  
		let startDate           =  this.state.startDate;
		let endDate             =  this.state.endDate;
		if(!!startDate && !!endDate) {
			startDate           =  startDate;
			endDate            	=  endDate;
		} else {
			if(!!!startDate && !!!endDate) {
				startDate            =  moment().subtract(1, 'months').format('YYYY-MM-DD');
				endDate            =  moment().format('YYYY-MM-DD');
			}
			if(!!startDate && !!!endDate) {
				startDate         =  startDate;
				endDate         =  startDate;
			}
			if(!!endDate && !!!startDate) {
				startDate         =  endDate;
				endDate         =  endDate;
			}
			this.setState({
				startDate      :  value_one,
				endDate        :  value_two
			})
		}

		data.start			=	startDate;
		data.end			=	endDate;
		data.user_type		=	this.state.type;
		if(!!!data.type) {
		   	data.type    =  'date';
		}
		//console.log('Filter Data : ', data);
		/* setFilter('reports', {
			user_type   :  this.props.userType,
			type        :  this.props.type,
			startDate   :  startDate,
			endDate     :  endDate,
			filterKeys  :  filterKeys
		}); */
		this.props.getReport(data, {
			user_type   :  this.props.userType,
			type        :  this.state.type,
			startDate   :  startDate,
			endDate     :  endDate,
			filterKeys  :  filterKeys
		});
	}

	handleTypeChange = (type) => {
		this.setState({
			type: type
		}, () => {
			this.handleUpdateFilter();
		})
		/* this.props.handleTypeChange(type, {
			user_type   :  this.props.userType,
			type        :  type,
			startDate   :  this.state.startDate,
			endDate     :  this.state.endDate,
			filterKeys  :  this.state.filterKeys
		}) */
	}

	componentDidMount() {    
		let filter     =  this.props.filterData;
		//console.log('Filter Did Mount : ', filter);
		//let filterKeys =  this.state.filterKeys;
		if(!isEmpty(filter) && filter.user_type === this.props.userType) {
			//type        =  filter.type;
			let filterKeys  =  filter.filterKeys;
			//let fromDate    =  filter.startDate || this.state.startDate;
			//let toDate      =  filter.endDate || this.state.endDate;
			let fromDate    =  this.state.startDate;
			let toDate      =  this.state.endDate;
			this.setState({
				filterKeys  :  filterKeys,
				startDate   :  fromDate,
				endDate     :  toDate,
				type        :  filter.type
			}, () => {
				this.handleUpdateFilter();
			})
		} else {
			let type       =  (this.props.userType === 'admin') ? 'general' : this.props.userType;
			this.setState({
				type : type
			}, () => {
				this.handleUpdateFilter();
			})
		}	
   	};

	render() {
		const { showFilter, showSearch } = this.state;

		let stateFilter = [];
		let stateCodeFilter = [];
		this.state.filterKeys.State.forEach((state) => {
			stateFilter.push(state.label);
			stateCodeFilter.push(state.value);
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
					  	<div className={`resfilter_btn ${showFilter ? "showfilter" : ""} `} onClick={this.toggleResFilter}><img src="/assets/search-ico.svg" alt="Search_ico" /> Filter</div>
					</div>

					<Form method="get" action="" autoComplete="off" className={`resfilter_box ${showFilter ? "showfilterbox":""}`}>
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
				</section>
				<section className="date_range_section">
	               	<div className="filter_label">Range: </div>
	               	<div className="InputFromTo">
	                  	<div className="DayPickerInput">
	                     	<Calendar
								selectDate={this.state.startDate}
								startDate={this.state.startDate}
								endDate={this.state.endDate}
								onSelectDate={this.onSelectStartDate}
								onDateRange={this.onDateRange}
								className="t_box"
								placeholder="Start Date"
								tillDate={this.tillDate}
	                     	/>
	                  	</div>
	                  	{' '}
	                  	<span className="to">to</span> {' '}
	                  	<span className="InputFromTo-to">
	                     	<div className="DayPickerInput">
		                        <Calendar
									selectDate={this.state.endDate}
									startDate={this.state.startDate}
									endDate={this.state.endDate}
									onSelectDate={this.onSelectEndDate}
									onDateRange={this.onDateRange}
									className="t_box"
									placeholder="End Date"
									disabled={!!!this.state.startDate}
									tillDate={this.tillDate}
		                        />
	                     	</div>
	                  	</span>
	               	</div>
	            </section>
				{/*<div className="liveOrders">313 Live Orders</div>*/}
	            {
		            (this.state.filterKeys.State.length > 0 || this.state.filterKeys.Area.length > 0 || this.state.filterKeys.Store.length > 0) ?
		            <section className="filter-tag_section">
		               	{
		                  	(this.state.filterKeys.State.length > 0) ?
		                     this.state.filterKeys.State.map((filter, index) => {
		                        return (
		                           <span key={`state-tag-${index}`} className="f-tag">{filter.label}
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
		                           	<span key={`area-tag-${index}`} className="f-tag">{filter.label}
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
		                           	<span key={`store-tag-${index}`} className="f-tag">{filter.label}
		                              	<a onClick={(e) => this.handleRemoveFilter(e, 'Store', index)}>
	                                 		<img src="/assets/cancel-ico.svg" alt="close" />
		                              	</a>
		                           	</span>
		                        )
	                     	}) : null
		               	}
		            </section>:null
	         	}
			</div>
		);
	};
};

export default Filter;