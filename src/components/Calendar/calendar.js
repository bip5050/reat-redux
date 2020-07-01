import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { isEmpty, isEqual, map as _map } from 'lodash';
import moment from 'moment-timezone';
import './calendar.css';

export default class Calendar extends Component {
   constructor(props) {
      super(props);
      this.state                                =  {
         month                    :   '',
         year                     :   '',
         show              :  false,
         noofdays          :  ''
      }
      this.monthName          =   ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.weekDaysArr        =  [];
      this.getMonthDays       =  this.getMonthDays.bind(this);
      this.prevMonth          =  this.prevMonth.bind(this);
      this.nextMonth          =  this.nextMonth.bind(this);
      this.selectDate         =  this.selectDate.bind(this);
      this.handleClick        =  this.handleClick.bind(this);
      this.handleDateRange    =  this.handleDateRange.bind(this);
      this.outerClick         =  this.outerClick.bind(this);
   }

   componentDidMount() {
      let date                =  new Date();
      let month               =  date.getMonth();
      let year                =  date.getFullYear();
      let calendar            =  this.getMonthDays(month, year);
      this.setState({         
         month          :  month,
         year           :  year,
         calendar       :  calendar
      }, function() {

      })
      document.addEventListener('click', this.outerClick)
   }

   outerClick(e) {
      e.stopPropagation();
      if(!!this.state.show && !this.node.contains(e.target) && e.target.getAttribute('data') !== 'ignore-outer-click') {
         this.setState({
            show: false
         })
      }
   }

   handleClick(){
      this.setState({
         show: !this.state.show
      })
   }

   handleDateRange(days, type) {
      let endDate          =  moment();
      let startDate        =  moment().subtract((days - 1), "days");
      //console.log('Date Range : ', days, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
      this.props.onDateRange({
         startDate   :  startDate.format('YYYY-MM-DD'),
         endDate     :  endDate.format('YYYY-MM-DD'),
         noofdays    :  (type === 'Custom') ? days : ''
      })
   }

   selectDate(date, month, week){
      let year          =  this.state.year;
      let fulldate      =  moment(`${year}-${(month + 1)}-${date}`).format('YYYY-MM-DD');
      //console.log(date, month, week, fulldate);
      this.props.onSelectDate(fulldate);
   }

   
   getMonthDays(month, year, selWeek = ''){
      let firstDate       =   new Date(year, month, 1);
      let firstDay        =   firstDate.getDay();
      let weekFirstDate   =   new Date(firstDate.setDate(firstDate.getDate()-firstDay));
      let date            =   weekFirstDate;
      let lastDate        =   new Date(year, month + 1, 0);
      let lastDay         =   lastDate.getDay();
      let weekLastDate    =   new Date(lastDate.setDate(lastDate.getDate()+(6-lastDay)));
      let days            =   [];
      let today           =   new Date();
      
      while (date.getTime() <= weekLastDate.getTime()) {
          let chkCurrDate        =   false;
          if(date.getDate() === new Date(date.getTime()).getDate().toString()
              && today.getMonth() === new Date(date.getTime()).getMonth()
              && today.getFullYear() === new Date(date.getTime()).getFullYear()
          ){
              chkCurrDate        =   true;
          }
          days.push({
              date         :  date.getDate(),
              month        :  date.getMonth(),
              year         :  date.getFullYear(),
              day          :  this.weekDaysArr[date.getDay()],
              fulldate     :  moment(date.getTime()).format('YYYY-MM-DD'),
              currentDate  :  chkCurrDate

          });
          date.setDate(date.getDate() + 1);
      }

      var i,j,chunk        =  7;
      let calendarArr      =  [];
      for (i=0,j=days.length; i<j; i+=chunk) {
          let arr          =  days.slice(i,i+chunk);
          calendarArr.push(arr);
      }

      let currentWeek      =  0;
      if(selWeek === ''){
          calendarArr.forEach((dateArr, k) => {
              if(dateArr.some(date => date.date === today.getDate() && date.month === today.getMonth()))
                  currentWeek     =   k;
          })
      } else {
          currentWeek     =   selWeek;
      }
      
      return {allDays: calendarArr, month: this.monthName[month], year: year, currentWeek: currentWeek};
   }

   prevMonth(week = ''){
      let month                     =  this.state.month;
      let year                      =  this.state.year;
      if(this.state.month === 0){
         month                      =  11;
         year                       =  (year - 1);
      }else{
         month                      =  (month - 1);
         year                       =  year;
      }
      let calendar                  =  this.getMonthDays(month, year, week);
      this.setState({
         month                      :   month,
         year                       :   year,
         calendar                   :  calendar
      })
   }

   nextMonth(week = ''){
      let month                     =  this.state.month;
      let year                      =  this.state.year;
      if(month === 11){
         month                      =  0;
         year                       =  (year + 1);
      }else{
         month                      =  (month + 1);
         year                       =  year;
      }
      let calendar                  =  this.getMonthDays(month, year, week);
      this.setState({
         month                      :   month,
         year                       :   year,
         calendar                   :  calendar
      })
   }
  
   onChangeHandle = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({ [name]: value }, function () {
      });
   }
   
   componentWillReceiveProps(props) {
      if(this.props.selectDate !== props.selectDate) {
         let date                =  new Date(props.selectDate);
         let month               =  date.getMonth();
         let year                =  date.getFullYear();
         let calendar            =  this.getMonthDays(month, year);
         this.setState({         
            month          :  month,
            year           :  year,
            calendar       :  calendar
         }, function() {

         })
      }
      if(this.state.noofdays !== props.noofdays) {
         this.setState({
            noofdays : props.noofdays
         })
      }
      /* this.setState({
         //show: false
      }) */
   }

   componentWillUnmount() {
      document.removeEventListener('click', this.outerClick);
   }

   render() {
      let calendar         =  this.state.calendar || {};
      let selectDate       =  this.props.selectDate || '';
      let startDate        =  this.props.startDate || '';
      let currTimestamp    =  (!!startDate) ? moment(startDate).format('X') : '';
      let endDate          =  this.props.endDate || '';
      let endTimestamp     =  (!!endDate) ? moment(endDate).format('X') : '';
      let tillDate         =  this.props.tillDate || '';
      let tillTimestamp    =  (!!tillDate) ? moment(tillDate).format('X') : '';
      let noofdays         =  this.props.noofdays || '';
      return (      
         <div ref={node => this.node = node} className={!this.state.show ? '': 'cOpen '}>
            
            <input type="text" className={this.props.className} placeholder={this.props.placeholder} value={selectDate} readOnly onClick={this.handleClick} disabled={!!this.props.disabled}/>
            
            <div className={!this.state.show ? 'calendar hide': 'calendar '}>
               <table>
                  <thead>
                  <tr>
                     <th colSpan="5">{calendar.month} {calendar.year}</th>
                     <th colSpan="2">
                        <span className="aro_sec">
                           <a onClick={this.prevMonth}><img src="/assets/chevron_right.svg" alt="left_arrow"/></a>
                           &nbsp;
                           <a onClick={this.nextMonth}><img src="/assets/chevron-right.svg" alt="right_arrow"/></a>
                        </span>
                     </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className="blue_bg">
                     <td width="14.285%">SU</td>
                     <td width="14.285%">MO</td>
                     <td width="14.285%">TU</td>
                     <td width="14.285%">WE</td>
                     <td width="14.285%">TH</td>
                     <td width="14.285%">FR</td>
                     <td width="14.285%">SA</td>
                  </tr>
                  {
                     (!!calendar.allDays && calendar.allDays.length > 0) ?
                     calendar.allDays.map((week, k) => {
                        return (
                           <tr key={k}>
                           {
                              week.map((days, i) => {
                                 let timestamp        =  moment(days.fulldate).format('X');
                                 let clsName          =  '';
                                 //console.log(tillDate);
                                 if(currTimestamp == timestamp)
                                    clsName           =  'select start';
                                 if(!!endTimestamp && timestamp < endTimestamp && currTimestamp < timestamp)
                                    clsName           =  'select range';
                                 if(!!endTimestamp && timestamp == endTimestamp && currTimestamp < timestamp)
                                    clsName           =  'select end';
                                 return (
                                    (!!tillTimestamp && tillTimestamp < timestamp) ?
                                    <td key={i} align="center" className="disabled">
                                       {days.date}
                                    </td> : <td key={i} align="center" className={clsName} onClick={()   => this.selectDate(days.date, days.month, k)}>
                                     {days.date}
                                  </td>
                                    
                                 )
                              })
                           }
                           </tr>
                        )
                     }) : null
                  }
                  </tbody>
               </table>
               <div className="cus_last_date">
                  <ul>
                     <li>Date Range</li>
                     <li onClick={() => this.handleDateRange(7, '')}>Last 7 days</li>
                     <li onClick={() => this.handleDateRange(30, '')}>Last 30 days</li>
                     <li onClick={() => this.handleDateRange(90, '')}>Last 90 days</li>
                     <li className="d_flex_n">
                        Last <input type="text" size="20" value={this.state.noofdays} name="noofdays" onChange={this.onChangeHandle}/> days
                        {
                           (!!this.state.noofdays && this.state.noofdays !== noofdays) ?
                           <a data="ignore-outer-click" onClick={() => this.handleDateRange(this.state.noofdays, 'Custom')}>
                              <img data="ignore-outer-click" src="/assets/checkmark_blue.svg" alt="check"/>
                           </a> : 
                           (!!noofdays && !!this.state.noofdays) ? 
                           <img src="/assets/checkmark_blue.svg" className="blackCheck" alt="check"/> 
                           : null
                        }
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      )
   }
}