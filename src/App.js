


import React, { Component } from 'react';
import './App.css';
//import 'https://use.typekit.net/yzo8xnv.css';
import './css/fonts.css';
import './css/style.css';
import './css/fonts.css';
import './css/fontawesome.css';
import Router from './routes';

class App extends Component {
  render() {
    return (     
        <div className="app header-fixed aside-menu-fixed sidebar-lg-show pace-done sidebar-lg-show">
              <div id="notify" className="notify"></div>
              <Router/>
        </div>
    );
  }
}

export default App;
/*
function PrivateRoute({ component: Component, ...rest }) {
  console.log('Apps : ', localStorage.getItem('states'))
  return (
    <Route
      {...rest}
      render={props =>
        (false) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
*/