import {
  GET_LIST,
  ADD_LIST,
  SET_CURRENT,
  CLEAR_CURRENT,
  LIST_ERROR,
  DELETE_LIST,
  CLEAR_ERRORS
} from "../types";

import { IList, IState, IAction } from "./IList";

const ListReducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case GET_LIST:
      return {
        ...state,
        lists: action.payload.map((list: IList) => {
          list.id = list._id;
          delete list._id;
          return list;
        }),
        loading: false
      };
    case ADD_LIST:
      action.payload.id = action.payload._id;
      delete action.payload._id;
      return {
        ...state,
        lists: [action.payload, ...state.lists],
        loading: false
      };
    case DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter(list => list.id !== action.payload),
        loading: false
      };
    case SET_CURRENT:
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
    default:
      return state;
  }
};

export default ListReducer;
