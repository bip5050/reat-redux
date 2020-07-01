import { takeEvery, put, call } from 'redux-saga/effects';
import * as loginConstant from '../constants';
import {error as notifyerror, success as notifysuccess} from '../../../util/notify';
import * as loginAction from '../actions';
import {callApi} from '../../../Helper/api';
import {setCookie,removeCookie, setLifetimeCookie, set as setDomainCookie} from '../../../util/cookies';
import Config from '../../../config';

//Do Login
export function* do_login(action){
    try {
        let url             =  '';
        url                 =  `auth/login`;
        let rawdata         =  action.data ;
        let  remember       =  rawdata.remember;  
        delete   rawdata.remember;
        const payload = yield call(callApi, 'POST', url, rawdata);
        // check for error
        if(payload.data.error){
            yield put(loginAction.listenLoginError(payload.data.error));
        }

        // handle success result
        if(payload.data.result){
            let result = payload.data.result;


            notifysuccess({message: 'You have successfully logged In. Please wait...'});
            //localStorage.setItem('user', JSON.stringify(result.user || {}));
            //console.log('States : ', Config.states);
            //localStorage.setItem('states', JSON.stringify(result.states || []));

            if(remember) {
                removeCookie("foodjets_merchant");
                setLifetimeCookie(result.user, 'foodjets_merchant');
               
            }  else {
                removeCookie("foodjets_merchant");
                setCookie(result.user, 'foodjets_merchant');
            }

            




            localStorage.setItem('states', JSON.stringify(Config.states || []));
           
            setDomainCookie(result.user);
            yield put(loginAction.listenLoginSuccess(result));
        }
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
}

export function* watchLoginStore() {
    try{
        yield takeEvery( loginConstant.DO_LOGIN, do_login );
    } catch(e){
        console.log(e)
    }
}