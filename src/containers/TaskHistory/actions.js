import {
  GET_HISTORY,
  GET_HISTORY_SUCCESS,
  GET_HISTORY_ERROR,

  EXPORT_CSV_TASK_HISTORY,
  EXPORT_CSV_TASK_HISTORY_SUCCESS,
  EXPORT_CSV_TASK_HISTORY_ERROR
} from "./constants";

export const getHistory = (data) => {
  return ({
    type: GET_HISTORY,
    data
  });
}

export const listenHistorySuccess = (data) => ({
  type: GET_HISTORY_SUCCESS,
  data
});

export const listenHistoryError = (data) => ({
  type: GET_HISTORY_ERROR,
  data
});

export const exportTaskCsv = (data) => {
  //console.log('Actions : ', data);
  return ({
    type: EXPORT_CSV_TASK_HISTORY,
    data
  });
}

export const listenExportTaskCsvSuccess = (data) => ({
  type: EXPORT_CSV_TASK_HISTORY_SUCCESS,
  data
});

export const listenExportTaskCsvError = (data) => ({
  type: EXPORT_CSV_TASK_HISTORY_ERROR,
  data
});