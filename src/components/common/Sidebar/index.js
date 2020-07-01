import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ToastModal from '../../../containers/Modals/toastModal';
import Config from '../../../config';
import { connect } from 'react-redux';
import {PropTypes as PT} from 'prop-types';
import {removeCookie, remove as removeDomainCookie} from '../../../util/cookies';

class Sidebar extends Component{
    constructor(props) {
        super(props);
        this.state              =   {
            userData: {},
            toastModalShow: false
        }
    }

    handleCloseModal = () =>{
         this.setState({ toastModalShow: false });
     };

     handleOpenModal = () => {
        this.setState({ toastModalShow: true });
     }

    handlecollapse(i) {
        let element = document.querySelector(".section_wrap");
        element.classList.toggle("close-pan");
    }
    componentDidMount(){
        var w = window.innerWidth;
        if(w<1025){
            let element = document.querySelector(".section_wrap");
            element.classList.add("close-pan"); 
        }
    }
    handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('states');
        removeCookie('foodjets_merchant');
        removeDomainCookie();
        window.location.href    =   '/login';
    }
    
    render() {
        const { toastModalShow} = this.state;
        const {userData, userType, currentPage } = this.props;
        return ( 
            <aside id="sideBar" className="left_nav">
                <span className="colaps" onClick={() => this.handlecollapse()}></span>
                <div className="navaria">
                <div className="t_menu">
                
                <div className="user_sec">
                    {/* <figure><img src="/assets/user.jpg" alt="" /></figure> */}
                    <div className="user-name">
                        Hello<span>{userData.first_name} {userData.last_name}</span>
                    </div>
                </div>
                <ul className="nav">
                    <li className={(currentPage === '/dashboard') ? 'active' : ''}><Link to="/dashboard"><img src="/assets/Dashboard.svg" /> Live Dashboard</Link></li>
                    <li className={(currentPage === '/task-history') ? 'active' : ''}><Link to="/task-history"><img src="/assets/Tasks.svg" /> All Tasks</Link></li>
                    <li className={(currentPage === '/feedback') ? 'active' : ''}><Link to="/feedback"><img src="/assets/Feedback.svg"/> Feedback</Link></li>
                    {
                        (!!this.props.showReport && this.props.showReport === 'true')?
                        <li className={(currentPage === '/reports') ? 'active' : ''}><Link to="/reports"><img src="/assets/Stats.svg" /> Reports</Link></li>:null
                    }

                    <li className={(currentPage === '/settings') ? 'active' : ''}><Link to="/settings"><img src="/assets/settings.svg" />  Settings</Link></li>
                    {/* <li className=""><a onClick={this.handleOpenModal}><img src="/assets/settings.svg" />  New Version</a></li> */}
                </ul>
                </div>
                <div className="b_menu">
                    {/* <a href={Config.cookie.hostname} className="ex-link">Switch To Older Version</a> */}
                    <a onClick={this.handleLogout} className="logout-btn">Sign Out</a>
                    <div className="poweredby">
                        <span>Powered by</span>
                        <img src="/assets/foodjets.svg" />
                    </div>
                </div>
                {
                    (!!toastModalShow) ?
                    <ToastModal toastModalShow={toastModalShow} handleCloseModal={this.handleCloseModal} /> : null
                } 
                </div>
                <div className="nav_bg" onClick={() => this.handlecollapse()}></div>
            </aside>
        )
    }
};

const loadHeaderData = ({ userData, userType, currentPage, showReport }) => {
    return (
        <Sidebar userData={userData} userType={userType} currentPage={currentPage} showReport={showReport}/>
    );
};

loadHeaderData.propTypes = {
    userData: PT.object,
    userType: PT.string,
    currentPage: PT.string,
    showReport: PT.string
};

const mapStateToProps = ({ headerReducer }, ownProps) => {
    return {
        userData: ownProps.user,
        currentPage: ownProps.currentPage,
        userType: headerReducer.userType,
        showReport: headerReducer.showReport
    }
};

export default connect(mapStateToProps)(loadHeaderData);