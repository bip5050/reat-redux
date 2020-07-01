import React, { Component } from 'react';
import LoginForm from '../../containers/Login';
import { withRouter } from 'react-router-dom';

class Login extends Component {
  render() {
    return (
      <div className="App">
        <LoginForm/>
      </div>
    );
  }
}

export default withRouter(Login);;
