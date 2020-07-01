import React from 'react';
import ReplyModal from './replyModal';
import moment from 'moment-timezone';
import { Card, Col, Row, Form } from 'reactstrap';
import TaskDetailsModal from './taskDetailsModal';
import { isEmpty, isEqual, map as _map } from 'lodash';

class FeedBackAdvanceFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			typeOpen: false,
            showSearch: false,
			search: {
                text                :   '',
                merchant_address    :   '',
                recipient_address   :   '',
                start_time          :   '',
                end_time            :   '',
                type                :   'order-number',
                field               :  'order_number',
                label               :   'Order Number'
            },
            repliedIds: [],    
            replyModalShow: false,
            orderDetailsModalShow: false
		};

		this.collapse = this.collapse.bind(this);
		this.resetSearch = this.resetSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
		this.handleSelectbox = this.handleSelectbox.bind(this);    
	};

	collapse(type) {
        this.setState({ typeOpen: false });
    }; 	

	handleSelectbox(cls) {
        this.setState({ [cls]: !this.state[cls] });
    };

    resetSearch() {
        this.setState({
            search: {
                text                :  '',
                merchant_address    :  '',
                recipient_address   :  '',
                delivery_time       :  '',
                start_date          :  '',
                end_date            :  '',
                type                :  'order-number',
                field               :  'order_number',
                label               :  'Order Number'
            },
            searchResultList            : []
        });
    };

    changeSearchType(data) {
        this.setState({ search: { type: data.type, label: data.label, field: data.field, text: '' }});
    }; 

    handleSearch(e) {
        let value = e.target.value;
        this.setState({
            search: { ...this.state.search, text: e.target.value }
        }, function () {
            if (value.length > 1){             
                this.props.searchFilter({
                    type: this.state.search.type,
                    [this.state.search.field]: value,
                    user_type: this.props.type
                });
            } else {
                this.setState({
                    searchResultList: []
                })
            }
        })
    }; 

    handleCloseModal(){
        this.setState({ replyModalShow: false, orderDetailsModalShow: false });
    };

    handleOpenModal(e, type, ordObj){
        e.stopPropagation();
        
        if(type === 'REPLY'){
            this.setState({ replyModalShow: true, taskDetails: ordObj });
        } else if(type === 'ORDERDETAILS'){
            this.setState({ orderDetailsModalShow: true, taskDetails: ordObj });
        }
    };

    componentWillReceiveProps(props) {
        if(props.replyResult && props.replyResult !== this.props.replyResult){
            let repliedIds = this.state.repliedIds || [];
            repliedIds.push(props.replyResult.task_id);

            this.setState({ replyModalShow: false, orderDetailsModalShow: false, repliedIds: repliedIds });
        }

        this.setState({ isSearching: props.isSearching, searchResultList: props.searchResultList, showSearch: props.showSearch });
    };

	render() {
		const { isSearching, searchResultList, replyModalShow, showSearch, orderDetailsModalShow, repliedIds, taskDetails } = this.state;		
        // console.log('!!!!repliedIds!!!!!', repliedIds);
        
		return (
			<div className={`searchMod_sec${(!!showSearch) ? '' : ' hide'}`}>
				<div className="s_bar">
              		<label>Search by:</label>
              		<Form method="get" action="" autoComplete="off">
              			<div className={`select-box ${this.state.typeOpen ? " sopen" : " "}`} onBlur={() => this.collapse('typeOpen')}>
	              			<div className="s-result" onClick={() => this.handleSelectbox('typeOpen')}>
	                            <input type="text" autoComplete="off" value={this.state.search.label} onChange={() => this.handleSelectbox('typeOpen')} name="searchType"/>
	                        </div>
							<ul>								
								<li onClick={() => this.changeSearchType({
                                    type: 'order-number',
                                    field: 'order_number',
                                    label: 'Order Number'
                                })}>Order Number</li>
								<li onClick={() => this.changeSearchType({
                                    type: 'name',
                                    field: 'name',
                                    label: 'Customer Name'
                                })}>Customer Name</li>
								<li onClick={() => this.changeSearchType({
                                    type: 'email',
                                    field: 'email',
                                    label: 'Customer Email'
                                })}>Customer Email</li>
							</ul>
                    	</div>

                    	<div className="resboxwrap">
                    		<div className="search_box">
                    			<input type="text"autoComplete="off" placeholder="Search" name="searchTxt" value={this.state.search.text} onChange={this.handleSearch} />
                    		</div>

                    		<button onClick={this.resetSearch} className="reset_btn" type="reset">Reset</button>
                     	</div>
              		</Form>
               </div>

               {
                    (!isEmpty(searchResultList) && searchResultList.length > 0) ? 
                    <div>
                        <div className="table_sec feed">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Customer Name</th>
                                        <th>Date · Time</th>
                                        <th>Rating</th>
                                        <th>Comments</th>
                                        <th>Follow Up</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        (searchResultList.length > 0) && searchResultList.map((el, index) => {
                                            let starObj = [];
                                            let rate = (el.rating)?parseInt(el.rating):0;
                                            
                                            for (let i = 0; i < rate; i++) {
                                                starObj.push(<img key={`star-sm-${i}`} src="/assets/star-sm.svg" />);
                                            }

                                            // let date = moment(el.time_stamp).format("YYYY-MM-DD");
                                            return (
                                                <tr key={`feedback-list-${index}`}>
                                                    <td>{el.tp_order_number} <span className="docmodbtn" onClick={(e)  => this.handleOpenModal(e, 'ORDERDETAILS', el.order_details)}><img src="/assets/doc.svg" /></span></td>
                                                    <td>{el.cust_first_name} {el.cust_last_name}</td>
                                                    <td>{el.time_stamp}</td>
                                                    <td><div className="starRange">{starObj}</div></td>
                                                    <td abbr="tr" className="acell">
                                                        <label>{el.comment}</label>
                                                        {
                                                            (el.comment)?
                                                            <span className="tTip">{el.comment}</span>:null
                                                        }

                                                    </td>
                                                    <td>
                                                        {
                                                            (el.reply === "true" || (repliedIds.indexOf(el.order_details.id) > -1))?
                                                            <span className="fbReply" style={{cursor: 'default'}}><img src="/assets/checkmark-black.svg" /></span>
                                                            :
                                                            <span className="fbReply" onClick={(e)  => this.handleOpenModal(e, 'REPLY', el)}>Reply</span>
                                                        }   
                                                    </td>
                                                </tr>   
                                            )
                                        })
                                    }                                           
                                </tbody>
                            </table>                        
                        </div>

                        <div className="resultCount">{searchResultList.length} SEARCH RESULT(S)</div>
                        <div className="t_result"></div>
                    </div> : <div className="noresult">Type to search and relevant results will appear</div>
                }   

                {
                    (!!replyModalShow) ?
                    <ReplyModal reply={this.props.reply} isReplying={this.props.isReplying} replyModalShow={replyModalShow} handleCloseModal={this.handleCloseModal.bind(this)} taskDetails={taskDetails} /> : null
                } 

                {
                    (!!orderDetailsModalShow) ?
                    <TaskDetailsModal isReplying={this.props.isReplying} orderDetailsModalShow={orderDetailsModalShow} handleCloseModal={this.handleCloseModal.bind(this)} taskDetails={taskDetails} /> : null
                }
			</div>	
		);
	};
};

export default FeedBackAdvanceFilter;