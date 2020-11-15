import React, { FC, useReducer } from "react";
import { Socket } from "socket.io";
import socketIOClient from "socket.io-client";

import AppContext from "./AppContext";
import AppReducer from "./AppReducer";

import { SET_SOCKET, CLEAR_SOCKET, TOGGLE_DARK_MODE } from "../types";

import {
  AppState as IAppState,
  InitialiseSocket,
  CloseSocket,
  ClearSocket,
  SetSocket,
  ResetSocket
} from "context";

const AppState: FC = props => {
  const initialState: IAppState = {
    socket: null,
    darkMode: false
  };

  const [state, dispatch] = useReducer(AppReducer, initialState);

  /*
   * Actions
   */

  const initialiseSocket: InitialiseSocket = () => {
    const socket = socketIOClient();

    setSocket(socket);
  };

  const closeSocket: CloseSocket = () => {
    state.socket && state.socket.close();
  };

  const clearSocket: ClearSocket = () => {
    closeSocket();

    dispatch({
      type: CLEAR_SOCKET
    });
  };
  const setSocket: SetSocket = (socket: Socket) => {
    closeSocket();

    dispatch({
      type: SET_SOCKET,
      payload: socket
    });
  };

  const resetSocket: ResetSocket = () => {
    closeSocket();

    initialiseSocket();
  };

  const toggleDarkMode = () => {
    dispatch({
      type: TOGGLE_DARK_MODE
    });
  };

  return (
    <AppContext.Provider
      value={{
        socket: state.socket,
        initialiseSocket,
        clearSocket,
        setSocket,
        resetSocket,
        toggleDarkMode
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
