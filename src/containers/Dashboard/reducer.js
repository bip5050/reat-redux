//import Config from '../../config';
const initialState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
    isProcessing: false,
    isTaskError: false,
    isTaskSuccess: false,
    isTaskProcessing: false,
    isEditTaskError: false,
    isEditTaskSuccess: false,
    isEditTaskProcessing: false,
    isDetailsError: false,
    isDetailsSuccess: false,
    isDetailsProcessing: false,
    isDeleteError: false,
    isDeleteSuccess: false,
    isDeleteProcessing: false,
    locations:{},
    taskDetails:{},
    filteredList: {},
    shoppedLate: {summary: {total_orders: 0, shopped_late: 0, shopping_late_percent: 0}, type: 'default'}
};

const DashboardReducer   =   (state=initialState, action) => {
    switch(action.type) {
        //Locations & Zones List
        case 'GET_LOCATIONS':
            return { ...state, isProcessing:true, isError:false, isSuccess:false };
        case 'GET_LOCATIONS_SUCCESS':
            return {...state, isProcessing:false, isError:false, isSuccess:true, locations:action.data};
        case 'GET_LOCATIONS_ERROR':
            return {...state, isProcessing:false, isError:true, isSuccess:false, locations:{}};
        
        //Create Task
        case 'CREATE_TASK':
            return { ...state, isTaskProcessing:true, isTaskError:false, isTaskSuccess:false };
        case 'CREATE_TASK_SUCCESS':
            return {...state, isTaskProcessing:false, isTaskError:false, isTaskSuccess:true};
        case 'CREATE_TASK_ERROR':
            return {...state, isTaskProcessing:false, isTaskError:true, isTaskSuccess:false};        
        
        //Edit Task
        case 'EDIT_TASK':
            return { ...state, isEditTaskProcessing:true, isEditTaskError:false, isEditTaskSuccess:false };
        case 'EDIT_TASK_SUCCESS':
            return {...state, isEditTaskProcessing:false, isEditTaskError:false, isEditTaskSuccess:true};
        case 'EDIT_TASK_ERROR':
            return {...state, isEditTaskProcessing:false, isEditTaskError:true, isEditTaskSuccess:false};

        
        //Task Details
        case 'GET_TASK_DETAILS':
            return { ...state, isDetailsProcessing:true, isDetailsError:false, isDetailsSuccess:false, taskDetails: {} };
        case 'GET_TASK_DETAILS_SUCCESS':
            return {...state, isDetailsProcessing:false, isDetailsError:false, isDetailsSuccess:true, taskDetails: action.data};
        case 'GET_TASK_DETAILS_ERROR':
            return {...state, isDetailsProcessing:false, isDetailsError:true, isDetailsSuccess:false, taskDetails: {}};

        //Delete Task
        case 'DELETE_TASK':
            return { ...state, isDeleteProcessing:true, isDeleteError:false, isDeleteSuccess:false };
        case 'DELETE_TASK_SUCCESS':
            return {...state, isDeleteProcessing:false, isDeleteError:false, isDeleteSuccess:true};
        case 'DELETE_TASK_ERROR':
            return {...state, isDeleteProcessing:false, isDeleteError:true, isDeleteSuccess:false};

        //Update Task Status
        case 'UPDATE_TASK_STATUS':
            return { ...state, isDeleteProcessing:true, isDeleteError:false, isDeleteSuccess:false };
        case 'UPDATE_TASK_STATUS_SUCCESS':
            return {...state, isDeleteProcessing:false, isDeleteError:false, isDeleteSuccess:true};
        case 'UPDATE_TASK_STATUS_ERROR':
            return {...state, isDeleteProcessing:false, isDeleteError:true, isDeleteSuccess:false};

        
        //Update Task Status
        case 'TASK_SEARCH':
            return { ...state, isSearching:true };
        case 'RESET_TASK_SEARCH':
            return {...state, filteredList: {} };
        case 'TASK_SEARCH_SUCCESS':
            return {...state, isSearching:false, filteredList: action.data };
        case 'TASK_SEARCH_ERROR':
            return {...state, isSearching:false, filteredList: {} };

        
        //Shopped Late
        case 'GET_SHOPPEDLATE':
            return { ...state, shoppedLate:{...initialState.shoppedLate} };
        case 'GET_SHOPPEDLATE_ERROR':
            return {...state, shoppedLate: {...initialState.shoppedLate} };
        case 'GET_SHOPPEDLATE_SUCCESS':
            return {...state, shoppedLate: action.data };

        //Default
        default:
        return state;
    }
}
export default DashboardReducer;