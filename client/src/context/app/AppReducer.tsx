import { SET_SOCKET, CLEAR_SOCKET, TOGGLE_DARK_MODE } from "../types";

import { Action, AppState } from "context";

const AppReducer = (state: AppState, action: Action): AppState => {
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
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode
      };
    default:
      return state;
  }
};

export default AppReducer;
