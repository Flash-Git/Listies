import { SET_SOCKET, CLEAR_SOCKET } from "../types";

import { Action, AppState } from "context";

const AlertReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      };
    case CLEAR_SOCKET:
      return {
        ...state,
        socket: null
      };
    default:
      return state;
  }
};

export default AlertReducer;
