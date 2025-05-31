import { Reducer } from "redux";
import { Action } from "../actions";
import {
  APP_ADD_NOTIFICATION,
  APP_CLEAR_NOTIFICATION,
  APP_END_LOADING,
  APP_REMOVE_NOTIFICATION,
  APP_START_LOADING,
} from "../types";
import { Notification } from "../actions/useNotification";

type AppState = {
  loading: boolean;
  notifications: Notification[];
};

const initialState: AppState = {
  loading: false,
  notifications: [],
};

const appReducer: Reducer<AppState, Action> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case APP_START_LOADING:
      return {
        ...state,
        loading: true,
      };

    case APP_END_LOADING:
      return {
        ...state,
        loading: false,
      };

    case APP_ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case APP_REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.key !== action.payload
        ),
      };

    case APP_CLEAR_NOTIFICATION:
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

export default appReducer;
