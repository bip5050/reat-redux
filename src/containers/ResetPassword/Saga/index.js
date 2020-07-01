import { takeEvery, put, call, takeLatest } from 'redux-saga/effects';
import * as resetpasswordConstant from '../constants';
import {error as notifyerror, success as notifysuccess} from '../../../util/notify';
import * as resetPasswordAction from '../actions';
import {callApi} from '../../../Helper/api';

//Do Login
export function* reset_password(action){
    try {
        let url             =  '';
        url                 =  `auth/reset-password`;
        const payload = yield call(callApi, 'POST', url, action.data);
        // check for error
        if(payload.data.error){
            yield put(resetPasswordAction.listenresetPasswordError(payload.data.error));
        }

        // handle success result
        if(payload.data.result){
            let result = payload.data.result;
            //notifysuccess({message: 'Login Successful'});
            yield put(resetPasswordAction.listenresetPasswordSuccess(result));
        }
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
}

export function* watchRsetPasswordStore() {
    try{
        yield takeLatest( resetpasswordConstant.RESET_PASSWORD, reset_password );
    } catch(e){
        console.log(e)
    }
}