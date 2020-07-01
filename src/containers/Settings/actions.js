import {
  GET_INFO,
  GET_INFO_ERROR,
  GET_INFO_SUCCESS,
  GET_STORES,
  GET_STORES_ERROR,
  GET_STORES_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_SUCCESS,
  CHANGE_PASS,
  CHANGE_PASS_ERROR,
  CHANGE_PASS_SUCCESS,
  ADD_LOCATION,
  ADD_LOCATION_ERROR,
  ADD_LOCATION_SUCCESS,
  EDIT_STORE,
  EDIT_STORE_ERROR,
  EDIT_STORE_SUCCESS,
  DELETE_STORE,
  DELETE_STORE_ERROR,
  DELETE_STORE_SUCCESS,
  GET_USER,
  GET_USER_ERROR,
  GET_USER_SUCCESS,
  ADD_USER,
  ADD_USER_ERROR,
  ADD_USER_SUCCESS,
  EDIT_USER,
  EDIT_USER_ERROR,
  EDIT_USER_SUCCESS,
  DELETE_USER,
  DELETE_USER_ERROR,
  DELETE_USER_SUCCESS,
  SUSPEND_USER,
  SUSPEND_USER_ERROR,
  SUSPEND_USER_SUCCESS
} from "./constants";

export const getInfo = (data) => ({
  type: GET_INFO,
  data
});

export const listenGetInfoError = (data) => ({
  type: GET_INFO_ERROR,
  data
});

export const listenGetInfoSuccess = (data) => ({
  type: GET_INFO_SUCCESS,
  data
});

export const getStores = (data) => ({
  type: GET_STORES,
  data
});

export const listenStoresError = (data) => ({
  type: GET_STORES_ERROR,
  data
});

export const listenStoresSuccess = (data) => ({
  type: GET_STORES_SUCCESS,
  data
});

export const updateProfile = (data) => ({
  type: UPDATE_PROFILE,
  data
});

export const listenUpdateProfileError = (data) => ({
  type: UPDATE_PROFILE_ERROR,
  data
});

export const listenUpdateProfileSuccess = (data) => ({
  type: UPDATE_PROFILE_SUCCESS,
  data
});

export const changePassword = (data) => ({
  type: CHANGE_PASS,
  data
});

export const listenChangePasswordError = (data) => ({
  type: CHANGE_PASS_ERROR,
  data
});

export const listenChangePasswordSuccess = (data) => ({
  type: CHANGE_PASS_SUCCESS,
  data
});

export const addLocation = (data) => ({
  type: ADD_LOCATION,
  data
});

export const listenAddLocationError = (data) => ({
  type: ADD_LOCATION_ERROR,
  data
});

export const listenAddLocationSuccess = (data) => ({
  type: ADD_LOCATION_SUCCESS,
  data
});

export const editStore = (data) => ({
  type: EDIT_STORE,
  data
});

export const listenEditStoreError = (data) => ({
  type: EDIT_STORE_ERROR,
  data
});

export const listenEditStoreSuccess = (data) => ({
  type: EDIT_STORE_SUCCESS,
  data
});

export const deleteStore = (data) => ({
  type: DELETE_STORE,
  data
});

export const listenDeleteStoreError = (data) => ({
  type: DELETE_STORE_ERROR,
  data
});

export const listenDeleteStoreSuccess = (data) => ({
  type: DELETE_STORE_SUCCESS,
  data
});

export const getUsers = (data) => ({
  type: GET_USER,
  data
});

export const listenGetUsersError = (data) => ({
  type: GET_USER_ERROR,
  data
});

export const listenGetUserSuccess = (data) => ({
  type: GET_USER_SUCCESS,
  data
});

export const addUser = (data) => ({
  type: ADD_USER,
  data
});

export const listenAddUsersError = (data) => ({
  type: ADD_USER_ERROR,
  data
});

export const listenAddUserSuccess = (data) => ({
  type: ADD_USER_SUCCESS,
  data
});

export const editUser = (data) => ({
  type: EDIT_USER,
  data
});

export const listenEditUsersError = (data) => ({
  type: EDIT_USER_ERROR,
  data
});

export const listenEditUserSuccess = (data) => ({
  type: EDIT_USER_SUCCESS,
  data
});

export const deleteUser = (data) => ({
  type: DELETE_USER,
  data
});

export const listenDeleteUsersError = (data) => ({
  type: DELETE_USER_ERROR,
  data
});

export const listenDeleteUserSuccess = (data) => ({
  type: DELETE_USER_SUCCESS,
  data
});

export const suspendUser = (data) => ({
  type: SUSPEND_USER,
  data
});

export const listenSuspendUsersError = (data) => ({
  type: SUSPEND_USER_ERROR,
  data
});

export const listenSuspendUserSuccess = (data) => ({
  type: SUSPEND_USER_SUCCESS,
  data
});