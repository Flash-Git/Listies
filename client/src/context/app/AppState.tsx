import React, { FC, useReducer } from "react";

import AppContext from "./AppContext";
import AppReducer from "./AppReducer";

// import {  } from "../types";

import { App } from "context";

const AppState: FC = (props) => {
  const initialState: App = {};

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
