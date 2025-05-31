import { useDispatch } from "../actions";
import {
  APP_ADD_NOTIFICATION,
  APP_CLEAR_NOTIFICATION,
  APP_REMOVE_NOTIFICATION,
} from "../types";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  key?: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

const useNotification = () => {
  const dispatch = useDispatch();

  /**
   * Show a notification by dispatching an action to add it to the application state.
   *
   * @param notification - The notification to be displayed.
   */
  const showNotification = (notification: Notification) => {
    const key = notification.key || Date.now().toString();

    dispatch({
      type: APP_ADD_NOTIFICATION,
      payload: {
        ...notification,
        key,
      },
    });

    // Auto dismiss if duration is provided
    if (notification.duration !== undefined && notification.duration > 0) {
      setTimeout(() => {
        dispatch({
          type: APP_REMOVE_NOTIFICATION,
          payload: key,
        });
      }, notification.duration);
    }
  };

  /**
   * Close a notification by dispatching an action to remove it from the application state.
   *
   * @param key - (Optional) The unique key of the notification to close.
   * If provided, only the notification with the matching key will be closed. If not provided,
   * all notifications will be cleared.
   */
  const closeNotification = (key?: string) => {
    if (key) {
      dispatch({
        type: APP_REMOVE_NOTIFICATION,
        payload: key,
      });
    } else {
      dispatch({
        type: APP_CLEAR_NOTIFICATION,
      });
    }
  };

  return { showNotification, closeNotification };
};

export default useNotification;
