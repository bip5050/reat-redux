const initialState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
    isProcessing: false,
    settingsData:{},
    userType:'',
    authenticateData: {},
    showReport: 'false',
    filterData: {},
    isFilterLoaded: false
};

const HomeReducer   =   (state=initialState, action) => {
    switch(action.type) {
        case 'GET_SETTINGS':
            return { ...state, isProcessing:true, isError:false, isSuccess:false, isFilterLoaded: false, logo:{}, filterData: {} };
        case 'GET_SETTINGS_SUCCESS':
            return {...state, isProcessing:false, isError:false, isSuccess:true, isFilterLoaded: true, logo:action.data.logo, settingsData:action.data.settings, userType: action.data.userType, showReport: action.data.showReport, filterData: action.data.filterData}
        case 'GET_SETTINGS_ERROR':
            return {...state, isProcessing:false, isError:true, isSuccess:false, isFilterLoaded: true, logo:{}, settingsData:{}, userType: '', showReport: 'false'};
        case 'AUTHENTICATE':
            return { ...state, isAuthenticateError:false };
        case 'AUTHENTICATE_SUCCESS':
            return {...state, isAuthenticateError:false, authenticateData:action.data};
        case 'AUTHENTICATE_ERROR':
            return {...state, isAuthenticateError:true, authenticateData:{}};
        case 'SYNC_FILTER':
            let filterData  =   state.filterData;
            filterData[action.data.key]     =   action.data.value;
            //console.log('Update Reducer : ', filterData);
            return {...state, filterData: filterData}
        
        //Default
        default:
        return state;
    }
};

export default HomeReducer;