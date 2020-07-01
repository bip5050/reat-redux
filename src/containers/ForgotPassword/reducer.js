const initialState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
    isProcessing: false,
    forgotPasswordData:{}
};

const ForgotPasswordReducer   =   (state=initialState, action) => {
    switch(action.type) {
        case 'FORGOT_PASSWORD_RESET':
            return { ...state, isProcessing:false, isError:false, isSuccess:false, forgotPasswordData: {} };
        case 'FORGOT_PASSWORD':
            return { ...state, isProcessing:true, isError:false, isSuccess:false, forgotPasswordData: {} };
        case 'FORGOT_PASSWORD_SUCCESS':
        console.log('Reducer : ', action.data);
            return {...state, isProcessing:false, isError:false, isSuccess:true, forgotPasswordData:action.data};
        case 'FORGOT_PASSWORD_ERROR':
            return {...state, isProcessing:false, isError:true, isSuccess:false, forgotPasswordData:action.data};

        //Default
        default:
        return state;
    }
}
export default ForgotPasswordReducer;