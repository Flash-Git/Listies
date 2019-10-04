import React, { useReducer } from "react";
import axios from "axios";

import ItemContext from "./ItemContext";
import ItemReducer from "./ItemReducer";

import {
  GET_ITEM,
  ADD_ITEM,
  ITEM_ERROR,
  DELETE_ITEM,
  CLEAR_ERRORS
} from "../types";

import { IState, IItem } from "./IItem";

const ItemState: React.FC = props => {
  const initialState: IState = {
    list: null,
    items: [],
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(ItemReducer, initialState);

  /*
   * Actions
   */

  const getItems = async (listId: string) => {
    try {
      dispatch({ type: "LOAD" });
      const res = await axios.get(`/api/items/${listId}`);
      dispatch({ type: GET_ITEM, payload: res.data });
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
    }
  };

  const addItem = async (item: IItem, listId: string) => {
    const config: any = {
      header: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(`/api/items/${listId}`, item, config);
      dispatch({ type: ADD_ITEM, payload: res.data });
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      dispatch({ type: DELETE_ITEM, payload: itemId });
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
    }

    //dispatch({ type: DELETE_LIST, payload: itemId });
  };

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <ItemContext.Provider
      value={{
        items: state.items,
        error: state.error,
        loading: state.loading,
        getItems,
        addItem,
        deleteItem,
        clearErrors
      }}
    >
      {props.children}
    </ItemContext.Provider>
  );
};

export default ItemState;
