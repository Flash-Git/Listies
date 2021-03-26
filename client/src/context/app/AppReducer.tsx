import {
  SET_SOCKET,
  CLEAR_SOCKET,
  IDENTIFIED_USER,
  TOGGLE_DARK_MODE,
  SET_DARK_MODE,
} from "../types";

import { Action, AppState } from "context";

const AppReducer = (state: AppState, { type, payload }: Action): AppState => {
  switch (type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: payload,
      };
    case CLEAR_SOCKET:
      return {
        ...state,
        socket: null,
      };
    case IDENTIFIED_USER:
      return {
        ...state,
        identifed: true,
      };
    case TOGGLE_DARK_MODE:
      localStorage.setItem("darkMode", `${!state.darkMode}`);

      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case SET_DARK_MODE:
      return {
        ...state,
        darkMode: payload,
      };
    default:
      return state;
  }
};

export default AppReducer;
