import { useReducer, FC, useContext } from "react";
import axios, { AxiosError } from "axios";

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

import { List, ListState as IListState, AuthContext as IAuthContext } from "context";

const ListState: FC = (props) => {
  const initialState: IListState = {
    lists: [],
    currentList: null,
    error: null,
    loading: false,
    hidden: false,
  };

  const [state, dispatch] = useReducer(ListReducer, initialState);

  const authContext: IAuthContext = useContext(AuthContext);
  const { logout } = authContext;

  const handleForbidden = (e: AxiosError) => {
    if (!e.response) return;
    if (e.response.status === 401) logout(e.response.data.message);
  };

  /*
   * Actions
   */

  const getLists = async () => {
    clearLists();
    dispatch({ type: LOADING });
    try {
      const res = await axios.get("/api/lists");
      dispatch({ type: GET_LISTS, payload: res.data });
    } catch (e) {
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const setLists = async (lists: List[]) => {
    dispatch({ type: SET_LISTS, payload: lists });
  };

  const addList = async (list: List) => {
    const config: any = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/lists", list, config);
      dispatch({ type: ADD_LIST, payload: res.data });
      setCurrentList(res.data);
    } catch (e) {
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const deleteList = async (id: string) => {
    try {
      // Delete items in list
      // const res = await axios.get(`/api/items/${id}`);
      // Deletes all associated items
      // res.data.map(
      //   (item: Item) => item._id && axios.delete(`/api/items/${item._id}`)
      // );

      // Delete list
      await axios.delete(`/api/lists/${id}`);
      dispatch({ type: DELETE_LIST, payload: id });
    } catch (e) {
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      dispatch({ type: DELETE_LIST, payload: id });
      handleForbidden(e);
    }
  };

  const setCurrentList = (list: List) => {
    dispatch({ type: SET_CURRENT, payload: list });
  };

  const clearCurrentList = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  const clearLists = () => dispatch({ type: CLEAR_LISTS });

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  const toggleHidden = () => {
    dispatch({ type: TOGGLE_HIDDEN });
  };

  const setHidden = (hidden: boolean) => {
    dispatch({ type: SET_HIDDEN, payload: hidden });
  };

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
        addList,
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
