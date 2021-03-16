import React, { FC, useReducer, useContext } from "react";
import axios from "axios";

import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import setAuthToken from "../../utils/setAuthToken";
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

import ListContext from "../list/ListContext";

import { AuthState as IAuthState, ListContext as IListContext } from "context";

const AuthState: FC = (props) => {
  const initialState: IAuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const listContext: IListContext = useContext(ListContext);
  const { setCurrentList, setHidden } = listContext;

  /*
   * Actions
   */

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
  }) => {
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
    localStorage.token && setAuthToken(localStorage.token);

    const currentList = localStorage.getItem("currentList");
    currentList && setCurrentList(JSON.parse(currentList));

    setHidden(localStorage.getItem("hidden") === "true" ? true : false);

    try {
      const res = await axios.get("/api/auth");
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (e) {
      dispatch({ type: AUTH_ERROR, payload: e.msg });
    }
  };

  const login = async (formData: { email: string; password: string }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/auth", formData, config);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      loadUser();
    } catch (e) {
      dispatch({ type: LOGIN_FAIL, payload: e.response.data.msg });
    }
  };

  const logout = () => dispatch({ type: LOGOUT });

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
