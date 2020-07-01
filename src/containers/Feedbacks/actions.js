import {
	GET_SUMMERY,
  GET_SUMMERY_SUCCESS,
  GET_SUMMERY_ERROR,

  GET_FEEDBACK,
  GET_FEEDBACK_SUCCESS,
  GET_FEEDBACK_ERROR,

  FEEDBACK_SEARCH, 
  FEEDBACK_SEARCH_SUCCESS,
  FEEDBACK_SEARCH_ERROR,

  REPLY,
  REPLY_SUCCESS,
  REPLY_ERROR
} from "./constants";

export const getSummary = (data) => ({
  type: GET_SUMMERY,
  data
});

export const listenGetSummerySuccess = (data) => ({
  type: GET_SUMMERY_SUCCESS,
  data
});

export const listenGetSummeryError = (data) => ({
  type: GET_SUMMERY_ERROR,
  data
});

export const getFeedback = (data) => ({
  type: GET_FEEDBACK,
  data
});

export const listenGetFeedbackSuccess = (data) => ({
  type: GET_FEEDBACK_SUCCESS,
  data
});

export const listenGetFeedbackError = (data) => ({
  type: GET_FEEDBACK_ERROR,
  data
});

export const feedbackSearch = (data) => ({
  type: FEEDBACK_SEARCH,
  data
});

export const listenFeedbackSearchSuccess = (data) => ({
  type: FEEDBACK_SEARCH_SUCCESS,
  data
});

export const listenFeedbackSearchError = (data) => ({
  type: FEEDBACK_SEARCH_ERROR,
  data
});

export const reply = (data) => ({
  type: REPLY,
  data
});

export const replySuccess = (data) => ({
  type: REPLY_SUCCESS,
  data
});

export const replyError = (data) => ({
  type: REPLY_ERROR,
  data
});