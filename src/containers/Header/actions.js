import {
  GET_SETTINGS,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_ERROR,
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
  SYNC_FILTER
} from "./constants";

export const getSettings = (data) => ({
type: GET_SETTINGS,
data
});

export const listenSettingsSuccess = (data) => ({
type: GET_SETTINGS_SUCCESS,
data
});

export const listenSettingsError = (data) => ({
type: GET_SETTINGS_ERROR,
data
});

export const authenticate = (data) => ({
  type: AUTHENTICATE,
  data
});

export const listenAuthenticateSuccess = (data) => ({
  type: AUTHENTICATE_SUCCESS,
  data
});

export const listenAuthenticateError = (data) => ({
  type: AUTHENTICATE_ERROR,
  data
});

export const syncFilter = (data) => ({
  type: SYNC_FILTER,
  data
})