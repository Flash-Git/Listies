import { useReducer, FC, useContext } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

import AuthContext from "../auth/AuthContext";

import ListContext from "./ListContext";
import ListReducer from "./ListReducer";

import {
  LOADING,
  GET_LISTS,
  SET_LISTS,
  ADD_LIST,
  SET_CURRENT,
  CLEAR_CURRENT,
  LIST_ERROR,
  DELETE_LIST,
  CLEAR_LISTS,
  CLEAR_ERRORS,
  TOGGLE_HIDDEN,
  SET_HIDDEN,
} from "../types";

import {
  ListState as IListState,
  AuthContext as IAuthContext,
  SetCurrentList,
  SetHidden,
  ToggleHidden,
  ClearErrors,
  ClearLists,
  ClearCurrentList,
  HandleForbidden,
  GetLists,
  SetLists,
  ConnectList,
  AddList,
  DeleteList,
} from "context";

const ListState = (props: any) => {
  const initialState: IListState = {
    lists: [],
    currentList: null,
    error: null,
    loading: false,
    hidden: false,
  };

  const [state, dispatch] = useReducer(ListReducer, initialState);

  const authContext: IAuthContext = useContext(AuthContext);
  const { user, logout } = authContext;

  const handleForbidden: HandleForbidden = (e) => {
    if (!e.response) return;
    if (e.response.status === 401) logout(e.response.data.message);
  };

  /*
   * Actions
   */

  const getLists: GetLists = async () => {
    clearLists();
    dispatch({ type: LOADING });
    try {
      const res = await axios.get("/api/lists");
      dispatch({ type: GET_LISTS, payload: res.data });
    } catch (e) {
      if (!e.response?.data.msg) return;
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const setLists: SetLists = async (lists) => dispatch({ type: SET_LISTS, payload: lists });

  const pushList: AddList = async (list) => {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/lists", list, config);
      addList(res.data);
      setCurrentList(res.data);
    } catch (e) {
      if (!e.response?.data.msg) return;
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const connectList: ConnectList = async (accessId: string, password: string) => {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`/api/lists/${accessId}`, { password }, config);
      addList(res.data);
      setCurrentList(res.data);
    } catch (e) {
      if (!e.response?.data.msg) return;
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const addList: AddList = async (list) => dispatch({ type: ADD_LIST, payload: list });

  const pushDeleteList: DeleteList = async (id: string) => {
    deleteList(id);

    try {
      await axios.delete(`/api/lists/${id}`);
    } catch (e) {
      if (!e.response?.data.msg) return;
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const deleteList: DeleteList = async (id) => dispatch({ type: DELETE_LIST, payload: id });

  const setCurrentList: SetCurrentList = (currentList) =>
    dispatch({ type: SET_CURRENT, payload: { user, currentList } });

  const clearCurrentList: ClearCurrentList = () => dispatch({ type: CLEAR_CURRENT });

  const clearLists: ClearLists = () => dispatch({ type: CLEAR_LISTS });

  const clearErrors: ClearErrors = () => dispatch({ type: CLEAR_ERRORS });

  const toggleHidden: ToggleHidden = () => dispatch({ type: TOGGLE_HIDDEN });

  const setHidden: SetHidden = (hidden) => dispatch({ type: SET_HIDDEN, payload: hidden });

  return (
    <ListContext.Provider
      value={{
        lists: state.lists,
        currentList: state.currentList,
        error: state.error,
        loading: state.loading,
        hidden: state.hidden,
        getLists,
        setLists,
        pushList,
        connectList,
        addList,
        pushDeleteList,
        deleteList,
        setCurrentList,
        clearCurrentList,
        clearLists,
        clearErrors,
        toggleHidden,
        setHidden,
      }}
    >
      {props.children}
    </ListContext.Provider>
  );
};

export default ListState;
