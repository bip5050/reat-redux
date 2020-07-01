import {
        GET_LOCATIONS,
        GET_LOCATIONS_SUCCESS,
        GET_LOCATIONS_ERROR,
        CREATE_TASK,
        CREATE_TASK_SUCCESS,
        CREATE_TASK_ERROR,
        EDIT_TASK,
        EDIT_TASK_SUCCESS,
        EDIT_TASK_ERROR,
        DELETE_TASK,
        DELETE_TASK_SUCCESS,
        DELETE_TASK_ERROR,
        GET_TASK_DETAILS,
        GET_TASK_DETAILS_SUCCESS,
        GET_TASK_DETAILS_ERROR,
        GET_TRACK_DETAILS,
        GET_TRACK_DETAILS_SUCCESS,
        GET_TRACK_DETAILS_ERROR,
        UPDATE_TASK_STATUS,
        UPDATE_TASK_STATUS_SUCCESS,
        UPDATE_TASK_STATUS_ERROR,
        TASK_SEARCH,
        TASK_SEARCH_SUCCESS,
        TASK_SEARCH_ERROR,
        GET_SHOPPEDLATE,
        GET_SHOPPEDLATE_SUCCESS,
        GET_SHOPPEDLATE_ERROR,
        RESET_TASK_SEARCH,
        UPDATE_FILTER
} from "./constants";
export const getLocations = (data) => ({
  type: GET_LOCATIONS,
  data
});

export const listenGetLocationsSuccess = (data) => ({
  type: GET_LOCATIONS_SUCCESS,
  data
});

export const listenGetLocationsError = (data) => ({
  type: GET_LOCATIONS_ERROR,
  data
});

export const createTask = (data) => ({
  type: CREATE_TASK,
  data
});

export const listenCreateTaskSuccess = (data) => ({
  type: CREATE_TASK_SUCCESS,
  data
});

export const listenCreateTaskError = (data) => ({
  type: CREATE_TASK_ERROR,
  data
});

export const editTask = (data) => ({
  type: EDIT_TASK,
  data
});

export const listenEditTaskSuccess = (data) => ({
  type: EDIT_TASK_SUCCESS,
  data
});

export const listenEditTaskError = (data) => ({
  type: EDIT_TASK_ERROR,
  data
});

export const getTrackDetails = (data) => ({
  type: GET_TRACK_DETAILS,
  data
});

export const listenGetTrackDetailsSuccess = (data) => ({
  type: GET_TRACK_DETAILS_SUCCESS,
  data
});

export const listenGetTrackDetailsError = (data) => ({
  type: GET_TRACK_DETAILS_ERROR,
  data
});

export const getTaskDetails = (data) => ({
  type: GET_TASK_DETAILS,
  data
});

export const listenGetTaskDetailsSuccess = (data) => ({
  type: GET_TASK_DETAILS_SUCCESS,
  data
});

export const listenGetTaskDetailsError = (data) => ({
  type: GET_TASK_DETAILS_ERROR,
  data
});

export const deleteTask = (data) => ({
  type: DELETE_TASK,
  data
});

export const listenDeleteTaskSuccess = (data) => ({
  type: DELETE_TASK_SUCCESS,
  data
});

export const listenDeleteTaskError = (data) => ({
  type: DELETE_TASK_ERROR,
  data
});

export const updateTaskStatus = (data) => ({
  type: UPDATE_TASK_STATUS,
  data
});

export const listenUpdateTaskStatusSuccess = (data) => ({
  type: UPDATE_TASK_STATUS_SUCCESS,
  data
});

export const listenUpdateTaskStatusError = (data) => ({
  type: UPDATE_TASK_STATUS_ERROR,
  data
});

export const resetSearch = (data) => ({
  type: RESET_TASK_SEARCH,
  data
});

export const search = (data) => ({
  type: TASK_SEARCH,
  data
});

export const listenSearchSuccess = (data) => ({
  type: TASK_SEARCH_SUCCESS,
  data
});

export const listenSearchError = (data) => ({
  type: TASK_SEARCH_ERROR,
  data
});

export const getShoppedLate = (data) => ({
  type: GET_SHOPPEDLATE,
  data
});

export const listenShoppedLateSuccess = (data) => ({
  type: GET_SHOPPEDLATE_SUCCESS,
  data
});

export const listenShoppedLateError = (data) => ({
  type: GET_SHOPPEDLATE_ERROR,
  data
});

export const updateFilter = (data) => ({
  type: UPDATE_FILTER,
  data
});