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

import { List, ListState, Action } from "context";

const ListReducer = (state: ListState, { type, payload }: Action): ListState => {
  switch (type) {
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_LISTS:
      return {
        ...state,
        lists: payload.map((list: List) => {
          if (list._id !== undefined) {
            list.id = list._id;
            delete list._id;
          }
          return list;
        }),
        loading: false,
      };
    case SET_LISTS:
      return {
        ...state,
        lists: payload,
      };
    case ADD_LIST:
      payload.id = payload._id;
      delete payload._id;
      return {
        ...state,
        lists: [payload, ...state.lists],
        loading: false,
      };
    case DELETE_LIST:
      if (state.currentList?.id === payload) localStorage.removeItem("currentList");
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== payload),
        currentList: state.currentList
          ? state.currentList.id === payload
            ? null
            : state.currentList
          : null,
        loading: false,
      };
    case SET_CURRENT:
      localStorage.setItem("lastUser", payload.user._id);
      localStorage.setItem("currentList", JSON.stringify(payload.currentList));
      return {
        ...state,
        currentList: payload.currentList,
        loading: false,
      };
    case CLEAR_CURRENT:
      localStorage.removeItem("currentList");
      return {
        ...state,
        currentList: null,
        loading: false,
      };
    case LIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_LISTS:
      return {
        ...state,
        lists: [],
        loading: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        loading: false,
      };
    case TOGGLE_HIDDEN:
      localStorage.setItem("hidden", (!state.hidden).toString());
      return {
        ...state,
        hidden: !state.hidden,
      };
    case SET_HIDDEN:
      localStorage.setItem("hidden", payload.toString());
      return {
        ...state,
        hidden: payload,
      };
    default:
      return state;
  }
};

export default ListReducer;
