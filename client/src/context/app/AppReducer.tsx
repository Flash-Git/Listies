import { SET_SOCKET } from "../types";

import { Action, AppState } from "context";

const AlertReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      };
    default:
      return state;
  }
};

export default AlertReducer;
