import { takeEvery, put, call } from 'redux-saga/effects';
import * as headerConstant from '../constants';
import {error as notifyerror} from '../../../util/notify';
import * as headerAction from '../actions';
import {callApi, callApiV2} from '../../../Helper/api';
import { setFilter } from '../../../Helper/common';

//Get Settings
export function* get_settings(action){
    try {
        let url             =  '';
        url                 =  `auth/get-user-settings`;
        const payload = yield call(callApiV2, 'GET', url);

        // check for error
        if(payload.data.error){
            //notifyerror(payload.data.error);
            yield put(headerAction.listenSettingsError());
        }

        // handle success result
        if(payload.data.result){
            let result = payload.data.result;
            let filter  =   result.filter || {};
            if(!!filter) {
                Object.keys(filter || {}).forEach(k => {
                    filter[k]       =   JSON.parse(filter[k] || '{}');
                })
            };

            yield put(headerAction.listenSettingsSuccess({
                settings: result.settings || {},
                userType: result.user_type || '',
                logo: {path: result.path, image: result.logo},
                showReport: result.show_report,
                filterData: filter
            }));
        }
    } catch (e) {
        //notifyerror(e);
        yield put(headerAction.listenSettingsError());
        console.log({message: e.message});
    }
}


//Authenticate
export function* authenticate(action){
    try {
        let url             =  '';
        url                 =  `auth/authenticate`;
        const payload = yield call(callApi, 'GET', url);
        
        // check for error
        if(payload.data.error){
            //notifyerror(payload.data.error);
            yield put(headerAction.listenAuthenticateError());
        }

        // handle success result
        if(payload.data.result){
            let result = payload.data.result;
            //console.log('Saga : ', result)
            //notifysuccess({message:result.message});
            yield put(headerAction.listenAuthenticateSuccess(result));
        }
    } catch (e) {
        //notifyerror(e);
        yield put(headerAction.listenAuthenticateError());
        console.log(e.message);
    }
}

export function* watchHeaderStore() {
    try{
        yield takeEvery( headerConstant.GET_SETTINGS, get_settings );
        yield takeEvery( headerConstant.AUTHENTICATE, authenticate );
    } catch(e){
        console.log(e)
    }
}