import React, { FC, useReducer } from "react";
import socketIOClient from "socket.io-client";

import AppContext from "./AppContext";
import AppReducer from "./AppReducer";

import { SET_SOCKET } from "../types";

import {
  AppState as IAppState,
  SetSocket,
  InitialiseSocket,
  Socket
} from "context";

const AppState: FC = props => {
  const initialState: IAppState = {
    socket
  };

  const [state, dispatch] = useReducer(AppReducer, initialState);

  /*
   * Actions
   */

  const resetSocket: SetSocket = () => {
    state.socket.close();
  };

  const setSocket: SetSocket = (socket: Socket) => {
    state.socket.close();

    dispatch({
      type: SET_SOCKET,
      payload: socket
    });
  };

  const initialiseSocket: InitialiseSocket = () => {
    const socket = socketIOClient();

    dispatch({
      type: SET_SOCKET,
      payload: socket
    });
  };

  return (
    <AppContext.Provider
      value={{ socket: state.socket, resetSocket, setSocket, initialiseSocket }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;

const socket = socketIOClient();
