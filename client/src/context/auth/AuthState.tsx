import { FC, useReducer } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import updateAuthTokenHeader from "../../utils/setAuthToken";

import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";

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

import {
  AuthState as IAuthState,
  ClearErrors,
  HandleForbidden,
  LoadUser,
  Login,
  Logout,
  Register,
  SendVerificationEmail,
  SetLoading,
} from "context";

const AuthState: FC = (props) => {
  const initialState: IAuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  /*
   * Actions
   */

  const handleForbidden: HandleForbidden = (e: AxiosError) => {
    if (!e.response) return;
    if (e.response.status === 401) logout(e.response.data.message);
  };

  const register: Register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/users", formData, config);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      loadUser();
    } catch (e) {
      if (!axios.isAxiosError(e) || !e.response?.data.msg) return;
      dispatch({ type: REGISTER_FAIL, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const sendVerificationEmail: SendVerificationEmail = async (email) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/verification", { email }, config);
      dispatch({ type: AUTH_EMAIL_SENT, payload: res.data.msg });
    } catch (e) {
      if (!axios.isAxiosError(e) || !e.response?.data.msg) return;
      dispatch({ type: AUTH_ERROR, payload: e.response.data.msg });
    }
  };

  const setLoading: SetLoading = async (loading) =>
    dispatch({ type: SET_LOADING, payload: loading });

  const loadUser: LoadUser = async () => {
    updateAuthTokenHeader(localStorage.token);

    try {
      const res = await axios.get("/api/auth");
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (e) {
      if (!axios.isAxiosError(e) || !e.response?.data.msg) return;
      dispatch({ type: AUTH_ERROR, payload: e.response.data.msg });
    }
  };

  const login: Login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res: AxiosResponse<{ token: string }> = await axios.post("/api/auth", formData, config);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      loadUser();
    } catch (e) {
      if (!axios.isAxiosError(e) || !e.response?.data.msg) return;
      dispatch({ type: LOGIN_FAIL, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const logout: Logout = (msg) => dispatch({ type: LOGOUT, payload: msg });

  const clearErrors: ClearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        sendVerificationEmail,
        setLoading,
        loadUser,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
