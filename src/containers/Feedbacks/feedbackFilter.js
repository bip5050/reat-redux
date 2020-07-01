import React from 'react';
import lodash from 'lodash';
import moment from 'moment-timezone';
import { Card, Col, Row, Form } from 'reactstrap';
import Calendar from '../../components/Calendar/calendar';
import FeedBackAdvanceFilter from './feedbackAdvanceFilter';
import {error as notifyerror} from '../../util/notify';
import { isEqual, isEmpty } from 'lodash';

class FeedBackFilter extends React.Component {
	constructor(props) {
		super(props);
		let endDate = moment().format('YYYY-MM-DD');
		let startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
		this.state = {
			area: {},
			stores: [],
			stateTxt: '',
		 	areaTxt: '',
		 	storeTxt: '',
			sOpen: false,
			aOpen: false,
			stOpen: false,	
		 	showSearch: false,
         	showFilter: false,
			filteredList: {},
			type: 'general',
			filterKeys: {State:[], Area: [], Store: []},
			makeSummeryFilterObj: {
				type: 'date',
				end: endDate, 
				start: startDate
			},
			makeFeedbackFilterObj: {
				page: 1,	
				type: 'date',
				end: endDate,
				start: startDate,			
				filter_rating_by: [],
				order_by: "date_time"
			},
			endDate: endDate,
			startDate: startDate,
			noofdays: '' 
		}; 

		this.areaDropdownInput = React.createRef();
		this.stateDropdownInput = React.createRef();
		this.storeDropdownInput = React.createRef();   
	};	

	updateFeedbackSummery = () => {
		let userType = this.state.type;
		let makeSummeryFilterObj = {...this.state.makeSummeryFilterObj}; 
		let AreaArray = (this.state.filterKeys && this.state.filterKeys.Area) || [];
		let StateArray = (this.state.filterKeys && this.state.filterKeys.State) || [];
		let StoreArray = (this.state.filterKeys && this.state.filterKeys.Store) || [];

		delete makeSummeryFilterObj.place;
		delete makeSummeryFilterObj.store_id;
		makeSummeryFilterObj.user_type = userType;
		if(StateArray.length > 0 || AreaArray.length > 0 && StoreArray.length > 0){
			if(makeSummeryFilterObj.type === 'store') {
				let storeIds = [];	
				StoreArray.forEach(function(skey) {
					storeIds.push(skey.store_id);
				});
				
				makeSummeryFilterObj.store_id = storeIds;
			} else if(makeSummeryFilterObj.type === 'place') {
				let placeObj = [];	
				StateArray.forEach(function(skey) {
					let areaIds = [];
					AreaArray.forEach(function(akey) {
						if(akey.state === skey.value){
							areaIds.push(akey.area_id);
						}
					});

					placeObj.push({
						zone_id: areaIds,
						state: skey.value
					});
				});

				makeSummeryFilterObj.place = placeObj;				
			}
		};

		// console.log('makeSummeryFilterObj', makeSummeryFilterObj);
		this.setState({ makeSummeryFilterObj: makeSummeryFilterObj }, ()=> {
			this.props.getSummary(makeSummeryFilterObj);
		});
	};

	updateFeedbackList = (filterData) => {
		let userType = this.state.type;
		let makeFeedbackFilterObj = {...this.state.makeFeedbackFilterObj}; 
		let AreaArray = (this.state.filterKeys && this.state.filterKeys.Area) || [];
		let StateArray = (this.state.filterKeys && this.state.filterKeys.State) || [];
		let StoreArray = (this.state.filterKeys && this.state.filterKeys.Store) || [];

		delete makeFeedbackFilterObj.place;
		delete makeFeedbackFilterObj.store_id;
		makeFeedbackFilterObj.user_type = userType;
		if(StateArray.length > 0 || AreaArray.length > 0 && StoreArray.length > 0){
			if(makeFeedbackFilterObj.type === 'store') {
				let storeIds = [];	
				StoreArray.forEach(function(skey) {
					storeIds.push(skey.store_id);
				});
				
				makeFeedbackFilterObj.store_id = storeIds;
			} else if(makeFeedbackFilterObj.type === 'place') {
				let placeObj = [];	
				StateArray.forEach(function(skey) {
					let areaIds = [];
					AreaArray.forEach(function(akey) {
						if(akey.state === skey.value){
							areaIds.push(akey.area_id);
						}
					});

					placeObj.push({
						zone_id: areaIds,
						state: skey.value
					});
				});

				makeFeedbackFilterObj.place = placeObj;				
			}
		};

		// console.log('getFeedback makeSummeryFilterObj', makeFeedbackFilterObj);
		this.setState({ makeFeedbackFilterObj: makeFeedbackFilterObj }, ()=> {
			//console.log(makeFeedbackFilterObj);
			let data		=	{
				...makeFeedbackFilterObj,
				filter: filterData
			}
			this.props.getFeedback(data);
		});
	};

	handleUpdateFilter	=	()	=>	{		
		this.updateFeedbackSummery();
		this.updateFeedbackList({
			makeFeedbackFilterObj: this.state.makeFeedbackFilterObj,
			makeSummeryFilterObj: this.state.makeSummeryFilterObj,
			user_type:this.props.userType,
			type: this.state.type,
			filterKeys: this.state.filterKeys
		});
		console.log('Feedback Update Filter : ', {
			makeFeedbackFilterObj: this.state.makeFeedbackFilterObj,
			makeSummeryFilterObj: this.state.makeSummeryFilterObj,
			user_type:this.props.userType,
			type: this.state.type,
			filterKeys: this.state.filterKeys
		})
	}
	
	handleTypeChange(type) {
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj};
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};

		makeFeedbackFilterObj.page = 1;
		this.setState({ 
			type: type, 
			allRatings: true, 
			filterByStart: [], 
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=>{
			this.handleUpdateFilter();

			if(!isEmpty(this.state.advSearchData)){
				this.props.feedbackSearch({ ...this.state.advSearchData, user_type: type });
			}
		});

      	//setFilter('FeedBack', { makeFeedbackFilterObj: makeFeedbackFilterObj, makeSummeryFilterObj: makeSummeryFilterObj, user_type:this.props.userType, type: type, filterKeys: this.state.filterKeys || {}});
	};

	handleStateChange = (e, selectedState) => {
		e.stopPropagation();
		let filterKeys = this.state.filterKeys || {};
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj};
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};

		let selIndex = filterKeys.State.findIndex((item) => {
			return item.value === selectedState.value;
		});

		if(selIndex === -1) {
			filterKeys.State.push({
				label: selectedState.label,
				value: selectedState.value
			});
		};

		makeSummeryFilterObj.type = 'place';
		makeFeedbackFilterObj.type = 'place';
		this.setState({
			stateTxt    :   '',
			filterKeys: filterKeys,
			makeSummeryFilterObj: makeSummeryFilterObj,
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=> {
			this.stateDropdownInput.current.focus();
			this.handleUpdateFilter();
		});

		//setFilter('FeedBack', { makeFeedbackFilterObj: makeFeedbackFilterObj, makeSummeryFilterObj: makeSummeryFilterObj, user_type:this.props.userType, type: this.state.type, filterKeys: filterKeys });
	};

	handleAreaChange = (e, selectedArea) => {
		e.stopPropagation();
		let filterKeys = this.state.filterKeys || {};
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj};
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};

		let selIndex = filterKeys.Area.findIndex((item) => {
			return item.value === selectedArea.delivery_zone_name;
		});

		if(selIndex === -1) {
			filterKeys.Area.push({
				area_id: selectedArea.id,
				state: selectedArea.state,
				value: selectedArea.delivery_zone_name,				
				label: `${selectedArea.delivery_zone_name} (${selectedArea.state})`
			});
		};

		makeSummeryFilterObj.type = 'place';
		makeFeedbackFilterObj.type = 'place';
		this.setState({ 
			areaTxt    :   '',
			filterKeys: filterKeys,
			makeSummeryFilterObj: makeSummeryFilterObj,
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=> {
			this.areaDropdownInput.current.focus();	
			this.handleUpdateFilter();
		});

		//setFilter('FeedBack', { makeFeedbackFilterObj: makeFeedbackFilterObj, makeSummeryFilterObj: makeSummeryFilterObj, user_type:this.props.userType, type: this.state.type, filterKeys: filterKeys });
	};

	handleStoreChange = (e, selectedStore) => {
		e.stopPropagation();
		let filterKeys = this.state.filterKeys || {};
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj};
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};

		let selIndex = filterKeys.Store.findIndex((item) => {
			return item.value === selectedStore.label;
		});

		if(selIndex === -1) {
			filterKeys.Store.push({
				label: selectedStore.label,
				value: selectedStore.label,
				store_id: selectedStore.data.store_id
			});
		};

		makeSummeryFilterObj.type = 'store';
		makeFeedbackFilterObj.type = 'store';
		this.setState({
			storeTxt    :   '',
			filterKeys: filterKeys,
			makeSummeryFilterObj: makeSummeryFilterObj,
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=> {
			this.storeDropdownInput.current.focus();
			this.handleUpdateFilter();
		});

		//setFilter('FeedBack', { makeFeedbackFilterObj: makeFeedbackFilterObj, makeSummeryFilterObj: makeSummeryFilterObj, user_type:this.props.userType, type: this.state.type, filterKeys: filterKeys });
	};

	handleRemoveFilter = (e, type, index) => {
		e.stopPropagation();
		let filters = this.state.filterKeys || [];
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj};
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};

		filters[type].splice(index, 1);
		if(type === 'State' && filters[type].length === 0){
			filters.Area = [];
			filters.Store = [];
		}

		if(type === 'Area' && filters[type].length === 0){
			filters.Store = [];
		}

		let selectedArea = (type !== 'Area') ? this.state.selectedArea : null;
		let selectedState = (type !== 'State') ? this.state.selectedState : null;
		let selectedStore = (type !== 'Store') ? this.state.selectedStore : null;

		makeSummeryFilterObj.type = (this.state.filterKeys.State.length > 0)?'place':'date';
		makeFeedbackFilterObj.type = (this.state.filterKeys.State.length > 0)?'place':'date';

		this.setState({
			filterKeys : filters,
			selectedArea: selectedArea,
			selectedState: selectedState,
			selectedStore: selectedStore,
			makeSummeryFilterObj: makeSummeryFilterObj,
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=> {
			this.handleUpdateFilter();
		});

		//setFilter('FeedBack', { makeFeedbackFilterObj: makeFeedbackFilterObj, makeSummeryFilterObj: makeSummeryFilterObj, user_type:this.props.userType, type: this.state.type, filterKeys: filters });
	};

	onSelectStartDate = (date) => {
		let startDate = moment(date).format('X'); 
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj}; 
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};   
		let endDate = moment(this.state.endDate).format('X');
		if(startDate > endDate){
			notifyerror({message: 'Start date should be lower than end date'});
			return false;
		};

		makeSummeryFilterObj.start = date;
		makeFeedbackFilterObj.start = date;
		this.setState({
			startDate: date,
			makeSummeryFilterObj: makeSummeryFilterObj,
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=>{
			this.handleUpdateFilter();
		});
	};

	onSelectEndDate = (date) => {  
		let endDate = moment(date).format('X');
		let makeSummeryFilterObj =  {...this.state.makeSummeryFilterObj}; 
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};
		let startDate= moment(this.state.startDate).format('X');  

		if(endDate < startDate){
			notifyerror({message: 'End date should be greater than start date'});
			return false;
		};

		makeSummeryFilterObj.end = date;
		makeFeedbackFilterObj.end = date;
		this.setState({
			endDate: date,
			makeSummeryFilterObj: makeSummeryFilterObj,
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=>{
			this.handleUpdateFilter();
		});
	};

	onDateRange = (date) => {
		let makeSummeryFilterObj = {...this.state.makeSummeryFilterObj}; 
		let makeFeedbackFilterObj =  {...this.state.makeFeedbackFilterObj};

		makeSummeryFilterObj.end = date.endDate;
		makeFeedbackFilterObj.end = date.endDate;

		makeSummeryFilterObj.start = date.startDate;
		makeFeedbackFilterObj.start = date.startDate;
		this.setState({
			startDate: date.startDate,
			endDate: date.endDate,
			noofdays: date.noofdays,
			makeSummeryFilterObj: makeSummeryFilterObj,
			makeFeedbackFilterObj: makeFeedbackFilterObj
		}, ()=>{
			this.handleUpdateFilter();
		});
	};

	handleSelectbox(type) {	
		if (type === 'Area' && this.state.filterKeys.State.length === 0)
			return;
		if (type === 'Store' && this.state.filterKeys.Area.length === 0)
			return;

		if(type === 'Area') {
			this.setState({
				sOpen: false,
				stOpen: false,
				aOpen: !this.state.aOpen,
				showSearch:false, 
				showFilter: false
			})
		};

		if(type === 'State') {
			this.setState({
				aOpen: false,
				stOpen: false,
				sOpen: !this.state.sOpen,
				showSearch:false, 
				showFilter: false
			})
		};

		if(type === 'Store') {
			this.setState({
				sOpen: false,
				aOpen: false,
				stOpen: !this.state.stOpen,
				showSearch:false, 
				showFilter: false
			})
		};
	};

	onChangeHandle(e) {
		const { name, value } = e.target;
		this.setState({ [name]: value }, function () { });
	};

	handleFilterOutsideClick = (e) => {
		e.stopPropagation();

		if(this.nodeState.contains(e.target) || 
		e.target.getAttribute('data') === 'ignore-state-outer-click' ||	
		this.nodeArea.contains(e.target) ||
		e.target.getAttribute('data') === 'ignore-area-outer-click' ||	 
		this.nodeStore.contains(e.target) || 
		e.target.getAttribute('data') === 'ignore-store-outer-click' ||	
		this.nodeSearch.contains(e.target) ||
		this.nodeSrchButton.contains(e.target) ||
		this.nodeResSrchButton.contains(e.target) ||
		e.target.getAttribute('data') === 'autosuggest'
		|| e.target.getAttribute('data') === 'ignore-outer-click'
		|| !!e.target.getAttribute('aria-hidden')){ 
			return;  
		};

		if(!!this.state.sOpen || !!this.state.aOpen || !!this.state.stOpen || !!this.state.showSearch) { 
			this.setState({ sOpen: false, aOpen: false, stOpen: false, showSearch: false, stateTxt:'', areaTxt: '', storeTxt: '' }); 
		};
  	};

	toggleCustomSearch() {
		this.setState({
			sOpen: false,
			aOpen: false,
			stOpen: false,
			showFilter: false,
			showSearch: !this.state.showSearch			
		});
	};

	toggleResFilter() {
		this.setState({ showSearch:false, showFilter: !this.state.showFilter });
	};

	componentWillReceiveProps(props) {
		this.setState({
			area: props.area || {},
			stores: props.stores || [],
			//filterKeys: props.filterKeys,
			filteredList: props.filteredList,
			/* makeFeedbackFilterObj: {
				...this.props.makeFeedbackFilterObj,
				pageno: 
			} */
		});
	};

	componentDidMount() {
		let filter     =  this.props.savedFilterData || {};
		if(!isEmpty(filter) && filter.user_type === this.props.userType) {
			this.setState({
				filterKeys  :  filter.filterKeys,
				makeFeedbackFilterObj   :  {
					...filter.makeFeedbackFilterObj,
					start: this.state.startDate,
					end: this.state.endDate
				},
				makeSummeryFilterObj   :  {
					...filter.makeSummeryFilterObj,
					start: this.state.startDate,
					end: this.state.endDate
				},
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
  		document.addEventListener('click', this.handleFilterOutsideClick);
  	};

	componentWillUnmount() {
		document.removeEventListener('click', this.handleFilterOutsideClick);
	};

	render() {
		const { filterKeys, area, sOpen, aOpen, stOpen, stateTxt, areaTxt, storeTxt, showSearch, showFilter } = this.state;
		//console.log('Filter Keys : ', filterKeys);
		let statesLocalStorage =  JSON.parse(localStorage.getItem('states') || '[]');      
		let states = statesLocalStorage.map((item) => {
			return { label: item.value, value: item.id }
		});
		states = lodash.orderBy(states, [state => state.value.toLowerCase()], ['asc']);
		
		let stateCodeFilter = [];
		filterKeys.State.forEach((state) => {
			stateCodeFilter.push(state.value);
		});

		let zoneList = stateCodeFilter.map(state => {
			return { state: state, zones: area[state] }
		});	 

		let storeList = [];
		filterKeys.Area.forEach((area) => {		
			this.state.stores.forEach((user) => {
				if((user.data.state === area.state) && (user.data.zone_id === area.area_id)){
					storeList.push(user);
				}
			});
		});

		let stores = lodash.orderBy(storeList, [store => store.label.toLowerCase()], ['asc']);
		
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
                        <div className={`resfilter_btn ${showFilter ? "showfilter":""} `} onClick={this.toggleResFilter.bind(this)}><img src="/assets/search-ico.svg" alt="Search_ico" /> Filter</div>
                        <div ref={nodeResSrchButton => this.nodeResSrchButton = nodeResSrchButton} className={`searchmod_btn ${showSearch ? "showpoint":""} `} onClick={this.toggleCustomSearch.bind(this)}><img src="/assets/search-ico.svg" alt="Search_ico" /> Search</div>
                    </div>

					<Form method="get" action="" autoComplete="off" className={`resfilter_box ${this.state.showFilter ? "showfilterbox":""}`}>
						<div className="filter_label">Filter by: </div>

						<div ref={nodeState => this.nodeState = nodeState} className={`select-box${sOpen ? " sopen" : " "}`}>
			                <div className="s-result" onClick={() => this.handleSelectbox('State')}>
			                	<input type="text" ref={this.stateDropdownInput} autoComplete="off" placeholder="State" name="stateTxt" value={stateTxt} onChange={this.onChangeHandle.bind(this)} />
			                </div>
			                <ul className={(filterKeys.State.length > 0) ? 'selected' : ''}>
								{
									(states || []).map((state, i) => {
										let selIndex = filterKeys.State.findIndex((stateItem) => {
											return (state.value === stateItem.value);
										});

										return (
											(state.label.toLowerCase().includes(stateTxt.toLowerCase())) ?
											<li key={`state-l-${i}`} data='ignore-state-outer-click' onClick={(e) => {
												(selIndex > -1)?
												this.handleRemoveFilter(e, 'State', selIndex)
												:
												this.handleStateChange(e, { ...state })
											}} className={(selIndex > -1)?"selected":""}>{state.label}</li> 
											:null
										)
									})
								}
							</ul>
						</div>

						<div ref={nodeArea => this.nodeArea = nodeArea} className={`select-box${aOpen ? " sopen" : " "}`}>
							<div className={`s-result ${(filterKeys.State.length === 0) ? "dis":" "}`} onClick={() => this.handleSelectbox('Area')}>
								<input type="text" ref={this.areaDropdownInput} autoComplete="off" disabled={(filterKeys.State.length === 0) ? true : false} placeholder="Area" name="areaTxt" value={areaTxt} onChange={this.onChangeHandle.bind(this)} />
							</div>

							<ul className={(filterKeys.Area.length > 0) ? 'selected' : ''}>
								{
									(zoneList || []).map((item, i) => {
										let zones = lodash.orderBy(item.zones, [zone => zone.delivery_zone_name.toLowerCase()], ['asc']);

										return (
											(zones || []).map((zone, index) => {
												let selIndex = filterKeys.Area.findIndex((areaItem) => {
													return (areaItem.state === item.state) && (areaItem.area_id === zone.id);
												});

												return (
													(zone.delivery_zone_name.toLowerCase().includes(areaTxt.toLowerCase())) ?
													<li key={`area-l-${index}`} data='ignore-area-outer-click' onClick={(e) => {
														(selIndex > -1)?
														this.handleRemoveFilter(e, 'Area', selIndex)
														:
														this.handleAreaChange(e, { ...zone, state: item.state })
													}} className={(selIndex > -1)?"selected":""}>{zone.delivery_zone_name} ({item.state})</li>
													:null
												)
											})
										)
									})
								}
							</ul>
						</div>

						<div ref={nodeStore => this.nodeStore = nodeStore} className={`select-box${stOpen ? " sopen" : " "}`}>
							<div className={`s-result ${(filterKeys.Area.length === 0) ? "dis":" "}`} onClick={() => this.handleSelectbox('Store')}>
								<input type="text" ref={this.storeDropdownInput} autoComplete="off" disabled={(filterKeys.Area.length === 0) ? true : false} placeholder="Store" name="storeTxt" value={storeTxt} onChange={this.onChangeHandle.bind(this)} />
							</div>

							<ul className={(filterKeys.Store.length > 0) ? 'selected' : ''}>
								{
									(stores || []).map((store, i) => {
										let selIndex = filterKeys.Store.findIndex((storeItem) => {
											return (storeItem.store_id === store.data.store_id);
										});

										return (
											(store.label.toLowerCase().includes(storeTxt.toLowerCase())) ?
												<li key={`store-l-${i}`} data='ignore-store-outer-click' onClick={(e) => {
													(selIndex > -1)?
													this.handleRemoveFilter(e, 'Store', selIndex)
													:
													this.handleStoreChange(e, { ...store })
												}} className={(selIndex > -1)?"selected":""}>{store.label}</li> : null
										)
									})
								}
							</ul>
						</div>
					</Form>

					<div className="search_sec">
						<div ref={nodeSrchButton => this.nodeSrchButton = nodeSrchButton} className={`searchmod_btn ${showSearch ? "showpoint" : ""} `} onClick={this.toggleCustomSearch.bind(this)}><img src="/assets/search-ico.svg" alt="Search_ico" /> Search</div>
					</div>
				</section>
				<section className="date_range_section">
					<div className="filter_label">Range: </div>
					<div className="InputFromTo">
						<div className="DayPickerInput">
							<Calendar
								selectDate={this.state.startDate}
								startDate={this.state.startDate}
								endDate={this.state.endDate}
								onDateRange={this.onDateRange}
								onSelectDate={this.onSelectStartDate}
								noofdays={this.state.noofdays}
								className="t_box"
								placeholder="Start Date"
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
									noofdays={this.state.noofdays}
									className="t_box"
									placeholder="End Date"
								/>
							</div>
						</span>
					</div>
				</section>

				<div className="liveOrders">{this.props.feedBackCount} Orders</div>

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
					</section>
					:null
				}

				<div ref={nodeSearch => this.nodeSearch = nodeSearch}>
					<FeedBackAdvanceFilter
						showSearch={showSearch}
						reply={this.props.reply}
						isReplying={this.props.isReplying}
						replyResult={this.props.replyResult}
						isSearching={this.props.isSearching}
						type={this.state.type}
						searchFilter={this.props.searchFilter}
						searchResultList={this.props.searchResultList}
					/>
				</div>
			</div>  	
		);
	};
};

export default FeedBackFilter;