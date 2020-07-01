import * as feedbackAction from '../actions';
import * as headerAction from '../../Header/actions';
import {callApiV2} from '../../../Helper/api';
import * as feedbackConstant from '../constants';
import { takeEvery, put, call, all } from 'redux-saga/effects';
import {error as notifyerror, success as notifysuccess, inform as notifyinform} from '../../../util/notify';

//Get Feedback
export function* getSummary(action){
    try {
        const payload = yield call(callApiV2, 'POST', 'feedback/summary', action.data);

        // check for error
        if(payload.data.error){
            yield put(feedbackAction.listenGetSummeryError());
        };

        if(payload.data.result){
            yield put(feedbackAction.listenGetSummerySuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* getFeedback(action){
    try {
        //console.log('Action Data : ', action.data);
        let data    =   {
            ...action.data,
            filter: {
                key: 'feedback',
                value: JSON.stringify(action.data.filter)
            }
        }
        yield put(headerAction.syncFilter({key: 'feedback', value: action.data.filter}));
        const payload = yield call(callApiV2, 'POST', 'feedback/list', data);

        // check for error
        if(payload.data.error){
            yield put(feedbackAction.listenGetFeedbackError());
        };

        if(payload.data.result){
            yield put(feedbackAction.listenGetFeedbackSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* feedbackSearch(action){
    try {
        const payload = yield call(callApiV2, 'POST', 'feedback/search', action.data);

        // check for error
        if(payload.data.error){
            yield put(feedbackAction.listenFeedbackSearchError());
        };

        if(payload.data.result){
            yield put(feedbackAction.listenFeedbackSearchSuccess(payload.data.result));
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* reply(action){
    try {
        const payload = yield call(callApiV2, 'POST', 'feedback/reply', action.data);

        // check for error
        if(payload.data.error){
            yield put(feedbackAction.replyError());
        };

        if(payload.data.result){
            let replyData = {...payload.data.result};
            replyData.task_id = action.data.task_id;
            replyData.order_number = action.data.order_number;
            yield put(feedbackAction.replySuccess(replyData));
            notifyinform({message: "Email sent sucessfully."});  
        };
    } catch (e) {
        notifyerror(e);
        console.log(e.message);
    }
};

export function* watchFeedbackStore() {
    try{
        yield takeEvery( feedbackConstant.REPLY, reply );
        yield takeEvery( feedbackConstant.GET_SUMMERY, getSummary );
        yield takeEvery( feedbackConstant.GET_FEEDBACK, getFeedback );
        yield takeEvery( feedbackConstant.FEEDBACK_SEARCH, feedbackSearch );
    } catch(e){
        console.log(e)
    }
};