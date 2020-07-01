import * as settingAction from '../actions';
import {callApi, callApiV2} from '../../../Helper/api';
import * as settingConstant from '../constants';
import { takeEvery, put, call, all } from 'redux-saga/effects';
import {error as notifyerror, success as notifysuccess} from '../../../util/notify';
import {setCookie, set as setDomainCookie, getCookie, get as getDomainCookie} from '../../../util/cookies';

//Get Setting
export function* getInfo(action){
    try {
        const payload = yield call(callApi, 'GET', '/auth/info');

        // check for error
        if(payload.data.error){
            yield put(settingAction.listenGetInfoError());
        };

        if(payload.data.result){
            yield put(settingAction.listenGetInfoSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};


//Get Stores
export function* getStores(action){
    try {
        const payload = yield call(callApi, 'GET', '/location/all');

        // check for error
        if(payload.data.error){
            yield put(settingAction.listenStoresError());
        };

        if(payload.data.result){
            yield put(settingAction.listenStoresSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

//Update Profile
export function* updateProfile(action){
    try {
        const payload = yield call(callApi, 'PUT', 'auth/profile', action.data);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenUpdateProfileError());
        };

        if(payload.data.result){
            notifysuccess({message: payload.data.result.message})
            let userData        =   getCookie('foodjets_merchant') || {};
            let updatedData     =   action.data;
            userData.first_name =   updatedData.first_name;
            userData.last_name  =   updatedData.last_name;
            userData.email      =   updatedData.email;
            setCookie(userData, 'foodjets_merchant');
            setDomainCookie(userData);
            //console.log('User Data : ', userData);  
            yield put(settingAction.listenUpdateProfileSuccess({}));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

//Change Password
export function* changePassword(action){
    try {
        //yield put(settingAction.listenAddLocation({}));

        const payload = yield call(callApi, 'PUT', 'auth/password', action.data);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenChangePasswordError());
        };

        if(payload.data.result){
            notifysuccess({message: payload.data.result.message})
            yield put(settingAction.listenChangePasswordSuccess({}));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

//Add Location
export function* addLocation(action){
    try {
        const payload = yield call(callApi, 'POST', 'location', action.data);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenAddLocationError());
        };

        if(payload.data){
            notifysuccess({message: payload.data.message})
            yield put(settingAction.listenAddLocationSuccess({}));
            yield put(settingAction.getStores());
        };
    } catch (e) {
        notifyerror({message: e.message});
        yield put(settingAction.listenAddLocationError());
        console.log(e.message);
    }
};

export function* getUsers(action){
    try {
        const payload = yield call(callApiV2, 'GET', 'auth/user-list', action.data);

        // check for error
        if(payload.data.error){
            yield put(settingAction.listenGetUsersError());
        };

        if(payload.data.result){
            yield put(settingAction.listenGetUserSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* addUser(action){
    try {
        const payload = yield call(callApiV2, 'POST', 'auth/user', action.data);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenAddUsersError(payload.data.error.message));
        };

        if(payload.data.result){
            notifysuccess({message: "User added sucessfully."});
            yield put(settingAction.listenAddUserSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* editUser(action){
    try {
        let actionId = action.data.id;
        let actionData = action.data;

        delete actionData.id;
        const payload = yield call(callApiV2, 'PUT', 'auth/user/'+actionId, actionData);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenEditUsersError(payload.data.error.message));
        };

        if(payload.data.result){
            notifysuccess({message: "User updated sucessfully."});
            yield put(settingAction.listenEditUserSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* deleteUser(action){
    try {
        const payload = yield call(callApiV2, 'DELETE', 'auth/user/'+action.data);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenDeleteUsersError(payload.data.error.message));
        };

        if(payload.data.result){
            notifysuccess({message: "User deleted sucessfully."});
            yield put(settingAction.listenDeleteUserSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* suspendUser(action){
    try {
        let actionId = action.data.id;
        let actionData = action.data;

        delete actionData.id;
        const payload = yield call(callApiV2, 'PUT', 'auth/user/'+actionId, actionData);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenSuspendUsersError());
        };

        if(payload.data.result){
            notifysuccess({message: "User suspended sucessfully."});
            yield put(settingAction.listenSuspendUserSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* editStore(action){
    try {
        let actionId = action.data.id;
        let actionData = action.data;

        delete actionData.id;
        //console.log('Data : ', action.data);
        //return false;
        const payload = yield call(callApi, 'PUT', 'location/'+actionId, actionData);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenEditStoreError(payload.data.error.message));
        };

        if(payload.data.result){
            notifysuccess({message: "Store updated sucessfully."});
            yield put(settingAction.listenEditStoreSuccess(payload.data.result));
            yield put(settingAction.getStores());
        };
    } catch (e) {
        yield put(settingAction.listenEditStoreSuccess());
        notifyerror({message: e.message});
        console.log(e.message);
    }
};

export function* deleteStore(action){
    try {
        //console.log('Action Data : ', action);
        //return false;
        const payload = yield call(callApi, 'DELETE', 'location/'+action.data);

        // check for error
        if(payload.data.error){
            notifyerror({message: payload.data.error.message});
            yield put(settingAction.listenDeleteStoreError(payload.data.error.message));
        };

        if(payload.data.result){
            notifysuccess({message: "Store deleted sucessfully."});
            yield put(settingAction.listenDeleteStoreSuccess(payload.data.result));
            yield put(settingAction.getStores());
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* watchSettingStore() {
    try{
        yield takeEvery( settingConstant.GET_INFO, getInfo );
        yield takeEvery( settingConstant.GET_STORES, getStores );
        yield takeEvery( settingConstant.GET_USER, getUsers );
        yield takeEvery( settingConstant.ADD_USER, addUser );
        yield takeEvery( settingConstant.EDIT_USER, editUser );
        yield takeEvery( settingConstant.DELETE_USER, deleteUser );
        yield takeEvery( settingConstant.SUSPEND_USER, suspendUser );
        yield takeEvery( settingConstant.UPDATE_PROFILE, updateProfile );
        yield takeEvery( settingConstant.CHANGE_PASS, changePassword );
        yield takeEvery( settingConstant.ADD_LOCATION, addLocation );
        yield takeEvery( settingConstant.EDIT_STORE, editStore );
        yield takeEvery( settingConstant.DELETE_STORE, deleteStore );
    } catch(e){
        console.log(e)
    }
};