const initialState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
    isProcessing: false,
    loginData:{}
};

const LoginReducer   =   (state=initialState, action) => {
    switch(action.type) {
        case 'DO_LOGIN':
            return { ...state, isProcessing:true, isError:false, isSuccess:false, loginData: {} };
        case 'DO_LOGIN_SUCCESS':
        console.log('Reducer : ', action.data);
            return {...state, isProcessing:false, isError:false, isSuccess:true, loginData:action.data};
        case 'DO_LOGIN_ERROR':
            return {...state, isProcessing:false, isError:true, isSuccess:false, loginData:action.data};

        //Default
        default:
        return state;
    }
}
export default LoginReducer;