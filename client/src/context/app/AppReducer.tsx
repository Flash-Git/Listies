import { SET_LOADING } from "../types";

import { IAction, IApp } from "./IApp";

const AlertReducer = (state: IApp, action: IAction): IApp => {
  switch (action.type) {
    default:
      return state;
  }
};

export default AlertReducer;
