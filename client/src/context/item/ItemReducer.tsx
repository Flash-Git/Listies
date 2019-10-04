import {
  GET_ITEM,
  ADD_ITEM,
  ITEM_ERROR,
  DELETE_ITEM,
  CLEAR_ERRORS
} from "../types";

import { IItem, IState, IAction } from "./IItem";

const ListReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case "LOAD":
      return {
        ...state,
        loading: true
      };
    case GET_ITEM:
      return {
        ...state,
        items: action.payload.map((item: IItem) => {
          item.id = item._id;
          delete item._id;
          return item;
        }),
        loading: false
      };
    case ADD_ITEM:
      action.payload.id = action.payload._id;
      delete action.payload._id;
      return {
        ...state,
        items: [action.payload, ...state.items],
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
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        loading: false
      };
    default:
      return state;
  }
};

export default ListReducer;
