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

import { IItem, IState, IAction } from "./IItem";

const ItemReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload.map((item: IItem) => {
          item.id = item._id;
          delete item._id;
          return item;
        }),
        loading: false
      };
    case SET_ITEMS:
      localStorage.setItem(
        "list" + action.payload.listId,
        JSON.stringify(
          action.payload.items.map((item: any) => {
            return item.id;
          })
        )
      );
      return {
        ...state,
        items: action.payload.items
      };
    case SORT_ITEMS:
      const filt = (item: IItem, imp: number) => item.importance === imp;
      return {
        ...state,
        items: [
          ...action.payload.filter((item: IItem) => filt(item, 2)),
          ...action.payload.filter((item: IItem) => filt(item, 1)),
          ...action.payload.filter((item: IItem) => filt(item, 0))
        ].map((item: IItem) => {
          item.id = item._id;
          delete item._id;
          return item;
        }),
        loading: false
      };
    case ADD_ITEM:
      action.payload.item.id = action.payload.item._id;
      delete action.payload.item._id;

      const newState = {
        ...state,
        items: [action.payload.item, ...state.items],
        loading: false
      };
      const ids: String[] = [];
      newState.items.map(item => {
        ids.push(item.id);
        return item;
      });
      localStorage.setItem("list" + action.payload.listId, JSON.stringify(ids));
      return newState;
    case EDIT_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        loading: false
      };
    case ITEM_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_ITEMS:
      return {
        ...state,
        items: []
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        loading: false
      };
    default:
      console.log("default");
      return state;
  }
};

export default ItemReducer;
