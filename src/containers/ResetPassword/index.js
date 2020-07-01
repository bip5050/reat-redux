import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {PropTypes as PT} from 'prop-types';
import * as actions from './actions';
import RsetpasswordForm from './resetPassword';

const ResetPassword = ({
                      isProcessing,
                      isError,
                      isSuccess,
                      resetPassword,
                      passwordnotmatch,
                      resetPasswordData,
                      errMassage
  }) => {
    return (
      <RsetpasswordForm
        isProcessing={isProcessing}
        isError={isError}
        isSuccess={isSuccess}
        resetPassword={resetPassword}
        passwordnotmatch = {passwordnotmatch}
        resetPasswordData={resetPasswordData}
        errMassage = {errMassage}
      />
    )
 };

 ResetPassword.propTypes   = {
  isProcessing: PT.bool,
  isError: PT.bool,
  isSuccess: PT.bool,
  resetPassword:PT.func,
  passwordnotmatch:PT.func,
  resetPasswordData:PT.object,
  errMassage: PT.string
 }

 const  mapStateToProps   = ({resetPasswordReducer}) => {
   console.log(resetPasswordReducer);
   return ({
      isProcessing: resetPasswordReducer.isProcessing,
      isError: resetPasswordReducer.isError,
      isSuccess: resetPasswordReducer.isSuccess,
      forgotPasswordData: resetPasswordReducer.resetPasswordData,
      errMassage: resetPasswordReducer.errMassage
    })
  }


const mapDispatchToProps = dispatch => ({
  resetPassword: (data) => dispatch(actions.resetPassword(data)),
  passwordnotmatch: () =>  dispatch(actions.passwordnotmatch())
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResetPassword));