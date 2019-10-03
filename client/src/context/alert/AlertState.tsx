import React, { useReducer } from "react";
import uuid from "uuid";

import AlertContext from "./AlertContext";
import AlertReducer from "./AlertReducer";

import { SET_ALERT, REMOVE_ALERT } from "../types";

import { IAlerts } from "./IAuth";

const AlertState: React.FC = props => {
  const initialState: IAlerts = [];

  const [state, dispatch] = useReducer(AlertReducer, initialState);

  /*
   * Actions
   */

  const setAlert = (msg: string, type: string, timeout: number = 5000) => {
    const id = uuid.v4();
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  const removeAlert = (id: string) =>
    dispatch({ type: REMOVE_ALERT, payload: id });

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
        removeAlert
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
