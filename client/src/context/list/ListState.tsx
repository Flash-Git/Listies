import React, { useReducer } from "react";
import axios from "axios";

import ListContext from "./ListContext";
import ListReducer from "./ListReducer";

import {
  GET_LIST,
  ADD_LIST,
  SET_CURRENT,
  CLEAR_CURRENT,
  LIST_ERROR,
  DELETE_LIST,
  CLEAR_ERRORS
} from "../types";

import { IState, IList } from "./IList";

const ListState: React.FC = props => {
  const initialState: IState = {
    lists: [],
    currentList: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(ListReducer, initialState);

  /*
   * Actions
   */

  const getLists = async () => {
    try {
      const res = await axios.get("/api/lists");
      dispatch({ type: GET_LIST, payload: res.data });
    } catch (e) {
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
    }
  };

  const addList = async (list: IList) => {
    const config: any = {
      header: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post("/api/lists", list, config);
      dispatch({ type: ADD_LIST, payload: res.data });
    } catch (e) {
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
    }
  };

  const deleteList = async (id: string) => {
    try {
      await axios.delete(`/api/lists/${id}`);
      dispatch({ type: DELETE_LIST, payload: id });
    } catch (e) {
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
    }

    dispatch({ type: DELETE_LIST, payload: id });
  };

  const setCurrentList = (list: IList) => {
    dispatch({ type: SET_CURRENT, payload: list });
  };

  const clearCurrentList = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <ListContext.Provider
      value={{
        lists: state.lists,
        currentList: state.currentList,
        error: state.error,
        loading: state.loading,
        getLists,
        addList,
        deleteList,
        setCurrentList,
        clearCurrentList,
        clearErrors
      }}
    >
      {props.children}
    </ListContext.Provider>
  );
};

export default ListState;
