//import Config from '../../config';
const initialState = {
    reportData: {},
    isLoading: false,
    isOrderLoading: false,
    isLateOrderLoading: false,
    lateOrder: {}
};

const ReportReducer = (state=initialState, action) => {
    switch(action.type) {
        case 'GET_REPORT':
            return { ...state, isLoading:true };
        case 'GET_REPORT_ERROR':
            return {...state, isLoading:false, reportData:{}};
        case 'GET_REPORT_SUCCESS':
            return {...state, isLoading:false, reportData: action.data};

        case 'GET_ORDER':
            return { ...state, isOrderLoading: true };
        case 'GET_ORDER_ERROR':
            return {...state, isOrderLoading: false /* reportData:{} */};
        case 'GET_ORDER_SUCCESS':
            //console.log('Report Data : ', state.reportData);
            return {...state, isOrderLoading:false, reportData: {...state.reportData, ordersData: action.data}};
        
        case 'GET_LATE_ORDER':
            return { ...state, isLateOrderLoading:true, /* lateOrder: {} */};
        case 'SORT_LATE_ORDERS':
            return { ...state,  isLateOrderLoading:true };
        case 'GET_LATE_ORDER_ERROR ':
            return {...state, isLateOrderLoading:false, unsortedLateOrders: {}, lateOrder:{}};
        case 'GET_LATE_ORDER_SUCCESS':        
            return {...state, isLateOrderLoading:false, unsortedLateOrders:action.data.unsortedLateOrders, lateOrder:action.data.arrangedTasks};

        //Default
        default:
        return state;
    }
};

export default ReportReducer;