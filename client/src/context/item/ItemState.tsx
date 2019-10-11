import React, { useReducer } from "react";
import axios from "axios";

import ItemContext from "./ItemContext";
import ItemReducer from "./ItemReducer";

import {
  LOADING,
  GET_ITEMS,
  SET_ITEMS,
  SORT_ITEMS,
  ADD_ITEM,
  EDIT_ITEM,
  ITEM_ERROR,
  DELETE_ITEM,
  CLEAR_ITEMS,
  CLEAR_ERRORS
} from "../types";

import { IState, IItem } from "./IItem";

const ItemState: React.FC = props => {
  const initialState: IState = {
    items: [],
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(ItemReducer, initialState);

  /*
   * Actions
   */

  const getItems = async (listId: string) => {
    clearItems();
    dispatch({ type: LOADING });
    try {
      const res = await axios.get(`/api/items/${listId}`);
      dispatch({ type: GET_ITEMS, payload: res.data });
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
    }
  };

  const setItems = async (items: IItem[]) => {
    dispatch({ type: SET_ITEMS, payload: items });
  };

  const sortItems = async () => {
    if (state.items.length > 1) dispatch({ type: SORT_ITEMS });
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

  const editItem = async (item: IItem) => {
    const config: any = {
      header: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.put(`/api/items/${item.id}`, item, config);
      dispatch({ type: EDIT_ITEM, payload: res.data });
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
  };

  const clearItems = () => dispatch({ type: CLEAR_ITEMS });

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <ItemContext.Provider
      value={{
        items: state.items,
        error: state.error,
        loading: state.loading,
        getItems,
        setItems,
        addItem,
        editItem,
        deleteItem,
        clearItems,
        clearErrors
      }}
    >
      {props.children}
    </ItemContext.Provider>
  );
};

export default ItemState;
