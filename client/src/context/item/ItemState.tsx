import React, { useReducer } from "react";
import axios from "axios";

import ItemContext from "./ItemContext";
import ItemReducer from "./ItemReducer";

import {
  LOADING,
  GET_ITEMS,
  SORT_ITEMS,
  ADD_ITEM,
  EDIT_ITEM,
  ITEM_ERROR,
  DELETE_ITEM,
  CLEAR_ERRORS
} from "../types";

import { IState, IItem } from "./IItem";
import Items from "../../components/items/Items";
import { regExpLiteral } from "@babel/types";

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
      dispatch({ type: LOADING });
      const res = await axios.get(`/api/items/${listId}`);
      if (res.data.length > 1)
        dispatch({ type: SORT_ITEMS, payload: res.data });
      else dispatch({ type: GET_ITEMS, payload: res.data });
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
    }
  };

  const sortItems = (items: IItem[]) => {
    if (items.length > 1) dispatch({ type: SORT_ITEMS, payload: items });
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

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <ItemContext.Provider
      value={{
        items: state.items,
        error: state.error,
        loading: state.loading,
        getItems,
        addItem,
        editItem,
        deleteItem,
        clearErrors
      }}
    >
      {props.children}
    </ItemContext.Provider>
  );
};

export default ItemState;
