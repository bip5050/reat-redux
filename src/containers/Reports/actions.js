import {
	GET_REPORT,
	GET_REPORT_ERROR,
	GET_REPORT_SUCCESS,
	GET_ORDER,
	GET_ORDER_ERROR,
  GET_ORDER_SUCCESS,
  GET_LATE_ORDER,
  SORT_LATE_ORDERS,
  GET_LATE_ORDER_ERROR,
  GET_LATE_ORDER_SUCCESS
} from "./constants";

export const getReport = (data) => ({
  type: GET_REPORT,
  data
});

export const listenGetReportError = (data) => ({
  type: GET_REPORT_ERROR,
  data
});

export const listenGetReportSuccess = (data) => ({
  type: GET_REPORT_SUCCESS,
  data
});

export const getOrder = (data) => ({
  type: GET_ORDER,
  data
});

export const listenGetOrderError = (data) => ({
  type: GET_ORDER_ERROR,
  data
});

export const listenGetOrderSuccess = (data) => ({
  type: GET_ORDER_SUCCESS,
  data
});

export const getLateOrders = (data) => ({
  type: GET_LATE_ORDER,
  data
});

export const sortLateOrders = (data) => ({
  type: SORT_LATE_ORDERS,
  data
});

export const listenLateOrders = (data) => ({
  type: GET_LATE_ORDER_ERROR,
  data
});

export const listenLateOrdersSuccess = (data) => ({
  type:  GET_LATE_ORDER_SUCCESS,
  data
});