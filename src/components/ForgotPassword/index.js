import React, { Component } from 'react';
import ForgotPasswordForm from '../../containers/ForgotPassword';
import { withRouter } from 'react-router-dom';

class ForgotPassword extends Component {
  render() {
    return (
      <div className="App">
        <ForgotPasswordForm/>
      </div>
    );
  }
}

export default withRouter(ForgotPassword);;
