import {all, call} from 'redux-saga/effects' ;
import { watchLoginStore } from '../containers/Login/Saga';
import { watchForgotPasswordStore } from '../containers/ForgotPassword/Saga';
import { watchRsetPasswordStore } from '../containers/ResetPassword/Saga';
import { watchHeaderStore } from '../containers/Header/Saga';
import { watchDashboardStore } from '../containers/Dashboard/Saga';
import { watchTaskHistoryStore } from '../containers/TaskHistory/Saga';
import { watchFeedbackStore } from '../containers/Feedbacks/Saga';
import { watchSettingStore } from '../containers/Settings/Saga';

import { watchReportStore } from '../containers/Reports/Saga';

export default function* rootSaga() {
  yield all([
    call(watchLoginStore),
    call(watchForgotPasswordStore),
    call(watchRsetPasswordStore),
    call(watchHeaderStore),
    call(watchTaskHistoryStore),
    call(watchDashboardStore),
    call(watchFeedbackStore),
    call(watchSettingStore),
    call(watchReportStore)
  ]);
}
