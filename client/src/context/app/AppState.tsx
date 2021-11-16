import { FC, useReducer } from "react";
import socketIOClient, { Socket } from "socket.io-client";

import AppContext from "./AppContext";
import AppReducer from "./AppReducer";

import {
  SET_SOCKET,
  CLEAR_SOCKET,
  IDENTIFIED_USER,
  TOGGLE_DARK_MODE,
  SET_DARK_MODE,
} from "../types";

import {
  AppState as IAppState,
  InitialiseSocket,
  CloseSocket,
  ClearSocket,
  SetSocket,
  ResetSocket,
  ToggleDarkMode,
  SetDarkMode,
  IdentifySelf,
  UpdateSocketList,
} from "context";

const AppState: FC = (props) => {
  const initialState: IAppState = {
    socket: null,
    darkMode: false,
    identifed: false,
  };

  const [state, dispatch] = useReducer(AppReducer, initialState);

  /*
   * Actions
   */

  const initialiseSocket: InitialiseSocket = () => {
    const socket: Socket = socketIOClient();

    setSocket(socket);
  };

  const closeSocket: CloseSocket = () => {
    state.socket && state.socket.close();
  };

  const clearSocket: ClearSocket = () => {
    closeSocket();

    dispatch({
      type: CLEAR_SOCKET,
    });
  };

  const setSocket: SetSocket = (socket) => {
    closeSocket();

    dispatch({
      type: SET_SOCKET,
      payload: socket,
    });
  };

  const identifySelf: IdentifySelf = (user) => {
    if (!state.socket) return;
    state.socket.emit("identify", user);
    dispatch({ type: IDENTIFIED_USER });
  };

  const updateSocketList: UpdateSocketList = (list) => {
    if (!state.socket) return;
    state.socket.emit("updateList", list);
  };

  const resetSocket: ResetSocket = () => {
    closeSocket();

    initialiseSocket();
  };

  const toggleDarkMode: ToggleDarkMode = () => {
    dispatch({
      type: TOGGLE_DARK_MODE,
    });
  };

  const setDarkMode: SetDarkMode = (darkMode) => {
    dispatch({
      type: SET_DARK_MODE,
      payload: darkMode,
    });
  };

  return (
    <AppContext.Provider
      value={{
        socket: state.socket,
        darkMode: state.darkMode,
        identifed: state.identifed,
        initialiseSocket,
        clearSocket,
        setSocket,
        identifySelf,
        updateSocketList,
        resetSocket,
        toggleDarkMode,
        setDarkMode,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
