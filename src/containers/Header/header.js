import React, { Component } from 'react';
import {PropTypes as PT} from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import {removeCookie, remove as removeDomainCookie} from '../../util/cookies';
import {
   Row,
   Container,
   Col
} from 'reactstrap';

class HeaderContainer extends Component{
   static propTypes = {
		isFetching           :  PT.bool,
		isProcessing         :  PT.bool,
		isError              :  PT.bool,
		isSuccess            :  PT.bool,
		settingsData         :  PT.object,
		getSettings          :  PT.func,
		authenticateData     :  PT.object,
		authenticate         :  PT.func,
		userData             :  PT.object
	}

	static defaultProps = {
		isFetching           :  false,
		isProcessing         :  false,
		isError              :  false,
		isSuccess            :  false,
      settingsData         :  {},
      userType             :  '',
      authenticateData     :  {},
      userData             :  {},
		getSettings          :  () => {}
	}

   constructor(props){
      super(props);
      this.state          =   {
         userData       :  this.props.userData,
         loginHeader : false,
      }
   }

   componentWillMount(){
      //console.log('Header Will Mount : ', this.props);
      let currentPage      =  this.props.currentPage || '';
      let userData         =  this.state.userData || {};
      //console.log('Header User : ', userData);
      if(!isEmpty(userData)) {
         document.title    =  `${userData.org_name} Dashboard`;
      }
      if(!isEmpty(userData)  && currentPage !== '/forgot-password' && currentPage !== '/login') {
         this.props.authenticate({token: userData.token});
      }
      if(currentPage !== '/' && currentPage !== '/forgot-password' && currentPage !== '/login'){
         this.props.getSettings();
         this.setState({
            loginHeader:true
         })
      }
   }

   /* componentDidMount() {   
      //console.log('Header Did Mount', this.props);
      let currentPage      =  this.props.currentPage || '';
      let userData         =  this.state.userData || {};
      //console.log('Header User : ', userData);
      if(!isEmpty(userData)) {
         document.title    =  `${userData.org_name} Dashboard`;
      }
      if(!isEmpty(userData)  && currentPage !== '/forgot-password' && currentPage !== '/login') {
         this.props.authenticate({token: userData.token});
      }
      if(currentPage !== '/' && currentPage !== '/forgot-password' && currentPage !== '/login'){
         this.props.getSettings();
         this.setState({
            loginHeader:true
         })
      }   
   } */

   componentWillReceiveProps(props){
      //console.log('Header Props : ', props);
      if((!isEmpty(props.authenticateData) && props.authenticateData.status === false) || !!props.isAuthenticateError){
         localStorage.removeItem('user');
         localStorage.removeItem('states');
        // removeCookie('foodjets_merchant');
         removeDomainCookie();
         removeCookie('foodjets_merchant');
         window.location.href='/login';
      }
   }
   

   render(){
      let userData      =  this.state.userData || {};
      let currentPage   =  this.props.currentPage || '';
      let fullname      =  '';
      if(currentPage !== '/' && currentPage !== '/forgot-password' && currentPage !== '/login') {
         if(this.props.userType === 'admin')
            fullname       =  'Admin View';
         if(this.props.userType === 'general')
            fullname       =  'General View';
         if(this.props.userType === 'pharmacy')
            fullname       =  'Pharmacy View';

            
            
      }
      return (           
         <header className={this.state.loginHeader?'':'logHeader'}>
            <Container fluid className="p-0">
               <Row noGutters>
                  <Col xs="6" md="8" sm="6" className="text-left h_left">
                  {
                     (!!this.state.loginHeader) ?
                        (!!this.props.logo && !!this.props.logo.image) ? 
                        <img src={`${this.props.logo.path}${this.props.logo.image}`}  className="Dash_logo" alt="Logo" />
                        :<img src="/assets/m_logo.svg" className="login_logo" alt="Logo" />
                     : <img src="/assets/foodjets.svg" className="login_logo" alt="Logo" />
                  }
                     {/* <img src="/assets/f-logo.svg" className="f_logo" alt="Logo" /> */}
                  </Col>
                  <Col xs="6" md="4" sm="6" className="h_right text-right">
                     {fullname} 
                  </Col>
               </Row>
            </Container>
         </header>
      )
   }
}
export default withRouter(HeaderContainer);