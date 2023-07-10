import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SET_LOADING,
  AUTH_EMAIL_SENT,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";

import { AuthState, Action } from "context";

const AuthReducer = (state: AuthState, { type, payload }: Action): AuthState => {
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        error: payload.msg ? payload.msg : null,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload,
      };
    case AUTH_EMAIL_SENT:
      return { ...state, error: payload };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        error: null,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
