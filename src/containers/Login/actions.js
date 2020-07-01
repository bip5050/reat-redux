import {
        DO_LOGIN,
        DO_LOGIN_SUCCESS,
        DO_LOGIN_ERROR
} from "./constants";

export const doLogin = (data) => ({
  type: DO_LOGIN,
  data
});

export const listenLoginSuccess = (data) => ({
  type: DO_LOGIN_SUCCESS,
  data
});

export const listenLoginError = (data) => ({
  type: DO_LOGIN_ERROR,
  data
});