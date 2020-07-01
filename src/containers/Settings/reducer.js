const initialState = {
    profileData         :   {},
    isLoading           :   false,
    isProcessing        :   false,
    isPassProcessing    :   false,
    isStoreLoading      :   false,
    isStoreProcessing   :   false,
    isLocProcessing     :   false,
    isUserLoading       :   false,
    isUserUpdating      :   false,
    storesList          :   [],
    usersList           :   {}
};

const SettingReducer = (state=initialState, action) => {
    switch(action.type) {
        case 'GET_INFO':
            return { ...state, isLoading:true, profileData:{} };
        case 'GET_INFO_ERROR':
            return {...state, isLoading:false, profileData:{}};
        case 'GET_INFO_SUCCESS':
            return {...state, isLoading:false, profileData:action.data};        
        
        case 'GET_STORES':
            return { ...state, isStoreLoading:true };
        case 'GET_STORES_ERROR':
            return {...state, isStoreLoading:false, storesList:{}};
        case 'GET_STORES_SUCCESS':
            return {...state, isStoreLoading:false, storesList:action.data};
        
        case 'UPDATE_PROFILE':
            return { ...state, isProcessing:true };
        case 'UPDATE_PROFILE_ERROR':
            return {...state, isProcessing:false};
        case 'UPDATE_PROFILE_SUCCESS':
            return {...state, isProcessing:false};
        
        case 'CHANGE_PASS':
            return { ...state, isPassProcessing:true };
        case 'CHANGE_PASS_ERROR':
            return {...state, isPassProcessing:false};
        case 'CHANGE_PASS_SUCCESS':
            return {...state, isPassProcessing:false};
        
        case 'ADD_LOCATION':
            return { ...state, isLocProcessing:true };
        case 'ADD_LOCATION_ERROR':
            return {...state, isLocProcessing:false};
        case 'ADD_LOCATION_SUCCESS':
            return {...state, isLocProcessing:false};

        case 'EDIT_STORE':
            return { ...state, isStoreProcessing:true };
        case 'EDIT_STORE_ERROR':
            return { ...state, isStoreProcessing:false };
        case 'EDIT_STORE_SUCCESS':
            return { ...state, isStoreProcessing:false };

        case 'DELETE_STORE':
            return { ...state };
        case 'DELETE_STORE_ERROR':
            return { ...state, storesList:{} };
        case 'DELETE_STORE_SUCCESS':
            return { ...state, storesList: action.data };

        case 'GET_USER':
            return { ...state, isUserLoading:true };
        case 'GET_USER_ERROR':
            return {...state, isUserLoading:false, usersList:{}};
        case 'GET_USER_SUCCESS':
            return {...state, isUserLoading:false, usersList: action.data};

        case 'ADD_USER':
            return { ...state, isUserUpdating:true };
        case 'ADD_USER_ERROR':
            return { ...state, isUserUpdating:false, usersList:{} };
        case 'ADD_USER_SUCCESS':
            return { ...state, isUserUpdating:false, usersList: action.data };

        case 'EDIT_USER':
            return { ...state, isUserUpdating:true };
        case 'EDIT_USER_ERROR':
            return { ...state, isUserUpdating:false, usersList:{} };
        case 'EDIT_USER_SUCCESS':
            return { ...state, isUserUpdating:false, usersList: action.data };

        case 'DELETE_USER':
            return { ...state, isUserUpdating:true };
        case 'DELETE_USER_ERROR':
            return { ...state, isUserUpdating:false, usersList:{} };
        case 'DELETE_USER_SUCCESS':
            return { ...state, isUserUpdating:false, usersList: action.data };

        case 'SUSPEND_USER':
            return { ...state, isUserUpdating:true };
        case 'SUSPEND_USER_ERROR':
            return { ...state, isUserUpdating:false, usersList:{} };
        case 'SUSPEND_USER_SUCCESS':
            return { ...state, isUserUpdating:false, usersList: action.data };

        //Default
        default:
        return state;
    }
};

export default SettingReducer;