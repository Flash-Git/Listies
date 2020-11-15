import React, { FC, useReducer } from "react";
import { Socket } from "socket.io";
import socketIOClient from "socket.io-client";

import AppContext from "./AppContext";
import AppReducer from "./AppReducer";

import { SET_SOCKET, CLEAR_SOCKET } from "../types";

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
    socket: null
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

  return (
    <AppContext.Provider
      value={{
        socket: state.socket,
        initialiseSocket,
        clearSocket,
        setSocket,
        resetSocket
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
