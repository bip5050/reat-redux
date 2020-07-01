import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {PropTypes as PT} from 'prop-types';
import * as actions from './actions';
import LoginForm from './login';

const Login = ({
                      isProcessing,
                      isError,
                      isSuccess,
                      doLogin,
                      loginData
  }) => {
    return (
      <LoginForm
        isProcessing={isProcessing}
        isError={isError}
        isSuccess={isSuccess}
        doLogin={doLogin}
        loginData={loginData}
      />
    )
 };

 Login.propTypes   = {
  isProcessing: PT.bool,
  isError: PT.bool,
  isSuccess: PT.bool,
  doLogin:PT.func,
  loginData:PT.object
 }

 const  mapStateToProps   = ({loginReducer}) => {
   return ({
      isProcessing: loginReducer.isProcessing,
      isError: loginReducer.isError,
      isSuccess: loginReducer.isSuccess,
      loginData: loginReducer.loginData
    })
  }


const mapDispatchToProps = dispatch => ({
  doLogin: (data) => dispatch(actions.doLogin(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));