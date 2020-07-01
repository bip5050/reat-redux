import {
        RESET_PASSWORD,
        RESET_PASSWORD_SUCCESS,
        RESET_PASSWORD_ERROR,
        RESET_PASSWORD_NOTMATCH
} from "./constants";

export const resetPassword = (data) => ({
  type: RESET_PASSWORD,
  data
});

export const listenresetPasswordSuccess = (data) => ({
  type: RESET_PASSWORD_SUCCESS,
  data
});

export const listenresetPasswordError = (data) => ({
  type: RESET_PASSWORD_ERROR,
  data
});
export const passwordnotmatch = (data) => ({
  type: RESET_PASSWORD_NOTMATCH,
  data
});