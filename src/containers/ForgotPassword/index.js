import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {PropTypes as PT} from 'prop-types';
import * as actions from './actions';
import ForgotPasswordForm from './forgotPassword';

const ForgotPassword = ({
                      isProcessing,
                      isError,
                      isSuccess,
                      forgotPassword,
                      forgotPasswordData,
                      forgotPasswordreset
  }) => {
    return (
      <ForgotPasswordForm
        isProcessing={isProcessing}
        isError={isError}
        isSuccess={isSuccess}
        forgotPassword={forgotPassword}
        forgotPasswordData={forgotPasswordData}
        forgotPasswordreset ={forgotPasswordreset}
      />
    )
 };

 ForgotPassword.propTypes   = {
  isProcessing: PT.bool,
  isError: PT.bool,
  isSuccess: PT.bool,
  forgotPassword:PT.func,
  forgotPasswordreset:PT.func,
  forgotPasswordData:PT.object
 }

 const  mapStateToProps   = ({forgotPasswordReducer}) => {
   return ({
      isProcessing: forgotPasswordReducer.isProcessing,
      isError: forgotPasswordReducer.isError,
      isSuccess: forgotPasswordReducer.isSuccess,
      forgotPasswordData: forgotPasswordReducer.forgotPasswordData
    })
  }


const mapDispatchToProps = dispatch => ({
  forgotPassword: (data) => dispatch(actions.forgotPassword(data)),
  forgotPasswordreset: () => dispatch(actions.forgotPasswordreset())
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ForgotPassword));