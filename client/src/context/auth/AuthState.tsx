import { FC, useReducer } from "react";
import axios, { AxiosResponse } from "axios";

import updateAuthTokenHeader from "../../utils/setAuthToken";

import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../types";

import { AuthState as IAuthState } from "context";

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

  const register = async (formData: { name: string; email: string; password: string }) => {
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
      dispatch({ type: REGISTER_FAIL, payload: e.response.data.msg });
    }
  };

  const loadUser = async () => {
    updateAuthTokenHeader(localStorage.token);

    try {
      const res = await axios.get("/api/auth");
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (e) {
      dispatch({ type: AUTH_ERROR, payload: e.response.data.msg });
    }
  };

  const login = async (formData: { email: string; password: string }) => {
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
      dispatch({ type: LOGIN_FAIL, payload: e.response.data.msg });
    }
  };

  const logout = (msg?: string) => {
    dispatch({ type: LOGOUT, payload: msg });
  };

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
