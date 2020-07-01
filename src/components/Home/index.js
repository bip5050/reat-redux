import React, { Component } from 'react';
//import HomeContainer from '../../containers/Home';
import { withRouter } from 'react-router-dom';
import {isEmpty} from 'lodash';
import {get as getDomainCookie, getCookie, setCookie} from '../../util/cookies';

class Home extends Component {
  componentDidMount() {   
    let user          = {};
    let currentCookie = getCookie('foodjets_merchant') || {};
    user              = currentCookie || {};
    if(!isEmpty(user)) {
      window.location.href='/dashboard';
    } else {
        window.location.href='/login';
    }
    /* if(typeof window !== 'undefined') {
       let user    =  localStorage.getItem('user');
       if(!_.isEmpty(user)) {
          window.location.href='/dashboard';
       } else {
          window.location.href='/login';
       }
    } */
  }

  render() {
    return (
      <div className="App">
        Loading....
      </div>
    );
  }
}

export default withRouter(Home);;
