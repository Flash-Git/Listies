import {
  GET_LISTS,
  SET_LISTS,
  ADD_LIST,
  SET_CURRENT,
  CLEAR_CURRENT,
  LIST_ERROR,
  DELETE_LIST,
  CLEAR_ERRORS,
  TOGGLE_HIDDEN,
  SET_HIDDEN
} from "../types";

import { IList, IState, IAction } from "./IList";

const ListReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case GET_LISTS:
      return {
        ...state,
        lists: action.payload.map((list: IList) => {
          list.id = list._id;
          delete list._id;
          return list;
        }),
        loading: false
      };
    case SET_LISTS:
      return {
        ...state,
        lists: action.payload
      };
    case ADD_LIST:
      action.payload.id = action.payload._id;
      delete action.payload._id;
      return {
        ...state,
        lists: [action.payload, ...state.lists],
        currentList: action.payload,
        loading: false
      };
    case DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter(list => list.id !== action.payload),
        currentList:
          state.currentList && state.currentList.id === action.payload
            ? null
            : state.currentList,
        loading: false
      };
    case SET_CURRENT:
      localStorage.setItem("currentList", JSON.stringify(action.payload));
      return {
        ...state,
        currentList: action.payload,
        loading: false
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        currentList: null,
        loading: false
      };
    case LIST_ERROR:
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
    case TOGGLE_HIDDEN:
      localStorage.setItem("hidden", (!state.hidden).toString());
      return {
        ...state,
        hidden: !state.hidden
      };
    case SET_HIDDEN:
      localStorage.setItem("hidden", action.payload.toString());
      return {
        ...state,
        hidden: action.payload
      };
    default:
      return state;
  }
};

export default ListReducer;
