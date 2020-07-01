//import Config from '../../config';
const initialState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
    isProcessing: false,
    taskHistory:{},
    csvUrl: {},
    isTaskCsvExporting: false
};

const taskHistoryReducer   =   (state=initialState, action) => {
    switch(action.type) {
        case 'GET_HISTORY':
            return { ...state, isProcessing:true, isError:false, isSuccess:false};
        case 'GET_HISTORY_SUCCESS':
            return {...state, isProcessing:false, isError:false, isSuccess:true, taskHistory:action.data};
        case 'GET_HISTORY_ERROR':
            return {...state, isProcessing:false, isError:true, isSuccess:false, taskHistory:{}};

        case 'EXPORT_CSV_TASK_HISTORY':
            return { ...state, isTaskCsvExporting:true, isError:false, isSuccess:false };
        case 'EXPORT_CSV_TASK_HISTORY_SUCCESS':
            return {...state, isTaskCsvExporting:false, isError:false, isSuccess:true, csvUrl: action.data};
        case 'EXPORT_CSV_TASK_HISTORY_ERROR':
            return {...state, isTaskCsvExporting:false, isError:true, isSuccess:false, csvUrl: {}};

        //Default
        default:
        return state;
    }
}
export default taskHistoryReducer;