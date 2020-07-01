import { combineReducers } from 'redux';
import loginReducer from '../containers/Login/reducer';
import forgotPasswordReducer from '../containers/ForgotPassword/reducer';
import resetPasswordReducer from '../containers/ResetPassword/reducer';
import headerReducer from '../containers/Header/reducer';
import dashboardReducer from '../containers/Dashboard/reducer';
import taskHistoryReducer from '../containers/TaskHistory/reducer';
import feedbackReducer from '../containers/Feedbacks/reducer';
import settingReducer from '../containers/Settings/reducer';
import reportReducer from '../containers/Reports/reducer';

export default combineReducers({
	loginReducer,
	forgotPasswordReducer,
	resetPasswordReducer,
	headerReducer,
	taskHistoryReducer,
	dashboardReducer,
	feedbackReducer,
	settingReducer,
	reportReducer
})