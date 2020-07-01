import { takeEvery, put, call } from 'redux-saga/effects';
import * as forgotPasswordConstant from '../constants';
import {error as notifyerror, success as notifysuccess} from '../../../util/notify';
import * as forgotPasswordAction from '../actions';
import {callApi} from '../../../Helper/api';

//Do Login
export function* forgot_password(action){
    try {
        let url             =  '';
        url                 =  `auth/forget-password`;
        const payload = yield call(callApi, 'POST', url, action.data);
        // check for error
        if(payload.data.error){
            yield put(forgotPasswordAction.listenForgotPasswordError(payload.data.error));
        }

        // handle success result
        if(payload.data.result){
            let result = payload.data.result;
            //notifysuccess({message: 'Login Successful'});
            yield put(forgotPasswordAction.listenForgotPasswordSuccess(result));
        }
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
}

export function* watchForgotPasswordStore() {
    try{
        yield takeEvery( forgotPasswordConstant.FORGOT_PASSWORD, forgot_password );
    } catch(e){
        console.log(e)
    }
}