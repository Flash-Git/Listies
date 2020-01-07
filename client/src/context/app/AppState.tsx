import React, { FC, useReducer } from "react";

import AppContext from "./AppContext";
import AppReducer from "./AppReducer";

// import {  } from "../types";

import { IApp } from "./IApp";

const AppState: FC = props => {
  const initialState: IApp = {};

  // eslint-disable-next-line
  const [state, dispatch] = useReducer(AppReducer, initialState);

  /*
   * Actions
   */

  return (
    <AppContext.Provider value={{ state }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
