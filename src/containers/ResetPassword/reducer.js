const initialState = {
    isFetching: false,
    isError: false,
    isSuccess: false,
    isProcessing: false,
    resetPasswordData:{},
    errMassage       :""
};

const resetPasswordReducer   =   (state=initialState, action) => {
   
    switch(action.type) {
        case 'RESET_PASSWORD':
            return { ...state, isProcessing:true, isError:false, isSuccess:false, resetPasswordData: {},
            errMassage :"" };
        case 'RESET_PASSWORD_SUCCESS':
        console.log('Reducer : ', action.data);
            return {...state, isProcessing:false, isError:false, isSuccess:true, resetPasswordData:action.data, errMassage :"" };
        case 'RESET_PASSWORD_ERROR':
           
            let msg = action.data.message;
            return {...state, isProcessing:false, isError:true, isSuccess:false, resetPasswordData:{}, errMassage :msg };

            case 'RESET_PASSWORD_NOTMATCH':
           
                let msgreset = "Password does not match";
                return {...state, isProcessing:false, isError:true, isSuccess:false, resetPasswordData:{}, errMassage :msgreset };
            
        //Default
        default:
        return state;
    }
}
export default resetPasswordReducer;