import {
        FORGOT_PASSWORD,
        FORGOT_PASSWORD_SUCCESS,
        FORGOT_PASSWORD_ERROR,
        FORGOT_PASSWORD_RESET
} from "./constants";

export const forgotPassword = (data) => ({
  type: FORGOT_PASSWORD,
  data
});


export const forgotPasswordreset = () => ({

type: FORGOT_PASSWORD_RESET,

});

export const listenForgotPasswordSuccess = (data) => ({
  type: FORGOT_PASSWORD_SUCCESS,
  data
});

export const listenForgotPasswordError = (data) => ({
  type: FORGOT_PASSWORD_ERROR,
  data
});