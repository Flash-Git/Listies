import { FC, useContext, useReducer } from "react";
import axios, { AxiosError } from "axios";

import AuthContext from "../auth/AuthContext";

import ItemContext from "./ItemContext";
import ItemReducer from "./ItemReducer";

import { Item, ItemState as IItemState, AuthContext as IAuthContext } from "context";

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
  CLEAR_ERRORS,
} from "../types";

const ItemState: FC = (props) => {
  const initialState: IItemState = {
    items: [],
    error: null,
    loading: true,
  };

  const [state, dispatch] = useReducer(ItemReducer, initialState);

  const authContext: IAuthContext = useContext(AuthContext);
  const { logout } = authContext;

  const handleForbidden = (e: AxiosError) => {
    if (!e.response) return;
    if (e.response.status === 401) logout(e.response.data.message);
  };

  /*
   * Actions
   */

  const getItems = async (listId: string) => {
    //TODO clean up
    clearItems();
    dispatch({ type: LOADING });
    try {
      const res = await axios.get(`/api/items/${listId}`);
      if (!localStorage["list" + listId]) {
        dispatch({ type: GET_ITEMS, payload: res.data });
        return;
      }
      const items: Item[] = [];
      const newItems: Item[] = res.data.map((item: Item) => {
        return item;
      });

      const localItemIds = JSON.parse(localStorage["list" + listId]);

      for (let i = 0; i < localItemIds.length; i++) {
        for (let j = 0; j < newItems.length; j++) {
          if (localItemIds[i] !== newItems[j]._id) continue;
          items.push(newItems[j]);
          newItems.splice(j, 1);
          j--;
          break;
        }
      }
      dispatch({ type: GET_ITEMS, payload: newItems.concat(items) });
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const setItems = async (items: Item[], listId: string) => {
    dispatch({ type: SET_ITEMS, payload: { items, listId } });
  };

  const sortItems = async () => {
    if (state.items.length > 1) dispatch({ type: SORT_ITEMS });
  };

  const pushItem = async (item: { name: string }, listId: string) => {
    const config: any = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`/api/items/${listId}`, { item, listId }, config);
      addItem(res.data, listId);
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const addItem = async (item: Item, listId: string) => {
    dispatch({ type: ADD_ITEM, payload: { item, listId } });
  };

  const pushEditItem = async (item: Item) => {
    const config: any = {
      header: {
        "Content-Type": "application/json",
      },
    };

    editItem(item);
    try {
      await axios.put(`/api/items/${item.id}`, item, config);
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const editItem = async (item: Item) => {
    dispatch({ type: EDIT_ITEM, payload: item });
  };

  const pushDeleteItem = async (itemId: string) => {
    deleteItem(itemId);

    try {
      await axios.delete(`/api/items/${itemId}`);
    } catch (e) {
      dispatch({ type: ITEM_ERROR, payload: e.response.data.msg });
      handleForbidden(e);
    }
  };

  const deleteItem = async (itemId: string) => {
    dispatch({ type: DELETE_ITEM, payload: itemId });
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
        pushItem,
        addItem,
        editItem,
        pushDeleteItem,
        pushEditItem,
        deleteItem,
        sortItems,
        clearItems,
        clearErrors,
      }}
    >
      {props.children}
    </ItemContext.Provider>
  );
};

export default ItemState;
