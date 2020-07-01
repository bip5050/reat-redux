//import Config from '../../config';
const initialState = {
    locations:{},
    feedbackData: {},
    isReplying: false,
    isLoading: false,
    isSearching: false,
    isFiltering: false,
    replyResult: {},
    searchResultList: {},
    feedbackSummeryData: {}
};

const FeedbackReducer   =   (state=initialState, action) => {
    switch(action.type) {
        case 'GET_SUMMERY':
            return { ...state, isLoading:true };
        case 'GET_SUMMERY_SUCCESS':
            return {...state, isLoading:false, feedbackSummeryData:action.data};
        case 'GET_SUMMERY_ERROR':
            return {...state, isLoading:false, feedbackSummeryData:{}};

        case 'GET_FEEDBACK':
            return { ...state, isFiltering:true};
        case 'GET_FEEDBACK_SUCCESS':
            return {...state, isFiltering:false, feedbackData:action.data};
        case 'GET_FEEDBACK_ERROR':
            return {...state, isFiltering:false, feedbackData:{}};

        case 'FEEDBACK_SEARCH':
            return { ...state, isSearching:true };
        case 'FEEDBACK_SEARCH_SUCCESS':
            return {...state, isSearching:false, searchResultList: action.data };
        case 'FEEDBACK_SEARCH_ERROR':
            return {...state, isSearching:false, searchResultList: {} };

        case 'REPLY':
            return { ...state, isReplying:true };
        case 'REPLY_SUCCESS':
            return {...state, isReplying:false, replyResult: action.data };
        case 'REPLY_ERROR':
            return {...state, isReplying:false, replyResult: {} };

        //Default
        default:
        return state;
    }
};

export default FeedbackReducer;