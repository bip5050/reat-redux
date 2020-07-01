import React, { Component } from 'react';
import ResetPassword from '../../containers/ResetPassword';
import { withRouter } from 'react-router-dom';

class ForgotPassword extends Component {

componentDidMount(){
  console.log(this.props);
}

  render() {
    return (
      <div className="App">
        <ResetPassword/>
      </div>
    );
  }
}

export default withRouter(ResetPassword);
