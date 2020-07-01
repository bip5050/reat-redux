
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';
import Dashboard from './components/Dashboard';
import Feedback from './components/Feedbacks';
import Settings from './components/Settings';
import Reports from './components/Reports';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import TaskHistory from './components/TaskHistory';
import {get as getDomainCookie, getCookie, setCookie} from './util/cookies';
import Config from './config';
import {
  Container
} from 'reactstrap';

export const routes = [{
    path: '/',
    exact: true,
    component: Home
  }, {
    path: '/login',
    component: Login,
    
  }, 
  {
    path: '/reset-password/:id',
    component: ResetPassword,
    
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    
  }];

export const privateRoutes = [{
  path: '/dashboard',
  component: Dashboard
}, {
  path: '/feedback',
  component: Feedback
}, {
  path: '/reports',
  component: Reports
}, {
  path: '/settings',
  component: Settings
}, {
  path: '/task-history',
  component: TaskHistory
}
];

export default function Router() {
  //console.log(getCookie('foodjets_merchant'), getDomainCookie());
  let user          = {};
  if(typeof window !== 'undefined') {
    let newCookie     = getDomainCookie() || {};
    let currentCookie = getCookie('foodjets_merchant') || {};
    //user              = newCookie || {};
    user              = currentCookie || {};
    if(newCookie.token != currentCookie.token) {
    //  setCookie(newCookie, 'foodjets_merchant');
      let states      = JSON.parse(localStorage.getItem('states') || '[]');
      //console.log('States : ', states, Config, Config.states, !!states, states.length === 0);
      if(states.length === 0)
        localStorage.setItem('states', JSON.stringify(Config.states || []));
      //window.location.reload();
    }
  }
  //console.log('Routes User : ', user);
  /* if(typeof window !== 'undefined' && !isEmpty(localStorage.getItem('user'))) {
    user            = JSON.parse(localStorage.getItem('user'));
  } */
  let location      = useLocation();
  let currentPage   = location.pathname;
  //console.log(location.pathname, currentPage, currentPage !== '/' && currentPage !== '/login', window.location.pathname);
  return (
    <React.Fragment>
      <Header user={user} currentPage={currentPage}/>
      <Container fluid className="p-0 section_wrap" >
        {
          (currentPage !== '/' && currentPage !== '/login' && currentPage !== '/forgot-password' && !currentPage.includes("/reset-password") ) ? <Sidebar user={user} currentPage={currentPage}/> : null
        }
        {/* <input type="checkbox" name="check" /> Yes */}
        <Switch>
          {privateRoutes.map((route) => (
            <PrivateRoute key={route.path} path={route.path} component={route.component} userData={user} />
          ))}
          {routes.map(route => (
            <Route key={`index ${route.path}`} {...route} />
          ))}
        </Switch>
      </Container>
    </ React.Fragment>  
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  let obj       = { component: Component, ...rest };
  let user      = obj.userData;
  //console.log('Private Route : ', !isEmpty(user));
  if(!isEmpty(user)) {
    return (
      <Route key={obj.path} path={obj.path} component={() => <obj.component userData={user} />} />
    )
  } else {
    //console.log('Unauthorised');
    return (
      <Redirect
        to={{
          pathname: "/login"
        }}
      />
    )
  }
}