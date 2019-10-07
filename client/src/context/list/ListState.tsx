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
  CLEAR_ERRORS,
  TOGGLE_HIDDEN
} from "../types";

import { IState, IList } from "./IList";
import { IItem } from "../item/IItem";

const ListState: React.FC = props => {
  const initialState: IState = {
    lists: [],
    currentList: null,
    error: null,
    loading: true,
    hidden: false
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
      const res = await axios.get(`/api/items/${id}`);
      res.data.map(
        (item: IItem) => item._id && axios.delete(`/api/items/${item._id}`)
      );

      await axios.delete(`/api/lists/${id}`);
      dispatch({ type: DELETE_LIST, payload: id });
    } catch (e) {
      dispatch({ type: LIST_ERROR, payload: e.response.data.msg });
      dispatch({ type: DELETE_LIST, payload: id });
    }
  };

  const setCurrentList = (list: IList) => {
    dispatch({ type: SET_CURRENT, payload: list });
  };

  const clearCurrentList = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  const toggleHidden = () => {
    dispatch({ type: TOGGLE_HIDDEN });
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
        addList,
        deleteList,
        setCurrentList,
        clearCurrentList,
        clearErrors,
        toggleHidden
      }}
    >
      {props.children}
    </ListContext.Provider>
  );
};

export default ListState;
