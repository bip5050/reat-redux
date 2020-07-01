import React from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import SettingComponent from './setting';
import { PropTypes as PT } from 'prop-types';
import { withRouter } from 'react-router-dom';

const Setting   = ({
	isLoading,
	isStoreLoading,
	isStoreProcessing,
	isPassProcessing,
	isProcessing,
	profileData,
	getInfo,
	userType,
	getStores,
	storesList,
	editStore,
	deleteStore,
	updateProfile,
	changePassword,
	addLocation,
	isLocProcessing,
	addUser,
	editUser,
	getUsers,
	suspendUser,
	deleteUser,
	usersList,
	isUserLoading,
	isUserUpdating
}) => {
	return (
		<SettingComponent
			isLoading			=	{isLoading}
			isStoreLoading		=	{isStoreLoading}
			isStoreProcessing	=	{isStoreProcessing}
			isPassProcessing	=	{isPassProcessing}
			isProcessing		=	{isProcessing}
			profileData			=	{profileData}
			getInfo				=	{getInfo}
			userType				=	{userType}
			getStores			=	{getStores}
			storesList			=	{storesList}
			editStore		    =	{editStore}
			deleteStore		    =	{deleteStore}
			updateProfile		=	{updateProfile}
			changePassword		=	{changePassword}
			addLocation			=	{addLocation}
			isLocProcessing		=	{isLocProcessing}
			addUser		        =	{addUser}
			editUser		    =	{editUser}
			getUsers		    =	{getUsers}
			deleteUser		    =	{deleteUser}
			suspendUser		    =	{suspendUser}
			usersList		    =	{usersList}
			isUserLoading		=	{isUserLoading}
			isUserUpdating		=	{isUserUpdating}
		/>
	)
};

Setting.propTypes   	=	{
	isStoreLoading		:	PT.bool,
	isStoreProcessing	:	PT.bool,
	isLoading			:	PT.bool,
	isPassProcessing	:	PT.bool,
	isProcessing		:	PT.bool,
	profileData			:	PT.object,
	storesList			:	PT.array,
	isLocProcessing		:	PT.bool,
	addUser             :   PT.func,
	editUser            :   PT.func,
	getUsers            :   PT.func,
	deleteUser          :   PT.func,
	suspendUser         :   PT.func,
	usersList           :   PT.object,
	isUserLoading       :   PT.bool,
	isUserUpdating      :   PT.bool,
	userType            :   PT.string
};

const mapStateToProps   =	({settingReducer, headerReducer}) => {	
	return ({
		isStoreLoading		:	settingReducer.isStoreLoading,
		isStoreProcessing	:	settingReducer.isStoreProcessing,
		isLoading			:	settingReducer.isLoading,
		isPassProcessing	:	settingReducer.isPassProcessing,
		isProcessing		:	settingReducer.isProcessing,
		profileData			:	settingReducer.profileData,
		storesList			:	settingReducer.storesList,
		isLocProcessing		:	settingReducer.isLocProcessing,
		usersList		    :	settingReducer.usersList,
		userType            :   headerReducer.userType,
		isUserLoading		:	settingReducer.isUserLoading,
		isUserUpdating	    :	settingReducer.isUserUpdating
	});
};

const mapDispatchToProps = dispatch => ({
	getInfo			:	(data) => dispatch(actions.getInfo(data)),
	getStores		:	(data) => dispatch(actions.getStores(data)),
	getUsers		:	(data) => dispatch(actions.getUsers(data)),
	addUser		    :	(data) => dispatch(actions.addUser(data)),
	editUser		:	(data) => dispatch(actions.editUser(data)),
	suspendUser		:	(data) => dispatch(actions.suspendUser(data)),
	deleteUser		:	(data) => dispatch(actions.deleteUser(data)),
	updateProfile	:	(data) => dispatch(actions.updateProfile(data)),
	changePassword	:	(data) => dispatch(actions.changePassword(data)),
	addLocation		:	(data) => dispatch(actions.addLocation(data)),
	editStore		:	(data) => dispatch(actions.editStore(data)),
	deleteStore		:	(data) => dispatch(actions.deleteStore(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Setting));