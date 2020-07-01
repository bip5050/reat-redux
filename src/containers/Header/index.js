import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {PropTypes as PT} from 'prop-types';
import * as actions from './actions';
import HeaderContainer from './header';

const Header = ({
                      isProcessing,
                      isError,
                      isSuccess,
                      isAuthenticateError,
                      getSettings,
                      settingsData,
                      userType,
                      authenticate,
                      authenticateData,
                      userData,
                      currentPage,
                      logo
  }) => {
    return (
      <HeaderContainer
        isProcessing={isProcessing}
        isError={isError}
        isSuccess={isSuccess}
        isAuthenticateError={isAuthenticateError}
        getSettings={getSettings}
        settingsData={settingsData}
        userType={userType}
        authenticate={authenticate}
        authenticateData={authenticateData}
        userData={userData}
        currentPage={currentPage}
        logo={logo}
      />
    )
 };

 Header.propTypes   = {
  isProcessing: PT.bool,
  isError: PT.bool,
  isSuccess: PT.bool,
  isAuthenticateError: PT.bool,
  getSettings:PT.func,
  settingsData:PT.object,
  userType:PT.string,
  authenticate:PT.func,
  authenticateData:PT.object,
  userData:PT.object,
  logo:PT.object,
  currentPage:PT.string
 }

 const  mapStateToProps   = ({headerReducer}, ownProps) => {
   return ({
      isProcessing: headerReducer.isProcessing,
      isError: headerReducer.isError,
      isSuccess: headerReducer.isSuccess,
      isAuthenticateError: headerReducer.isAuthenticateError,
      settingsData: headerReducer.settingsData,
      logo: headerReducer.logo,
      userType: headerReducer.userType,
      authenticateData: headerReducer.authenticateData,
      userData: ownProps.userData,
      currentPage: ownProps.currentPage
    })
  }


const mapDispatchToProps = dispatch => ({
  getSettings: (data) => dispatch(actions.getSettings(data)),
  authenticate: (data) => dispatch(actions.authenticate(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));