declare module "context" {
  import { Socket } from "socket.io-client";

  export type Action = {
    payload?: any;
    type: string;
  };

  /*
   * App
   */

  export type InitialiseSocket = () => void;

  export type CloseSocket = () => void;

  export type ClearSocket = () => void;

  export type SetSocket = (socket: Socket) => void;

  export type ResetSocket = () => void;

  export type ToggleDarkMode = () => void;

  export type SetDarkMode = (darkMode: boolean) => void;

  export type AppState = {
    socket: Socket | null;
    darkMode: boolean;
  };

  export interface AppContext extends AppState {
    initialiseSocket: InitialiseSocket;
    closeSocket: CloseSocket;
    clearSocket: ClearSocket;
    setSocket: SetSocket;
    resetSocket: ResetSocket;
    toggleDarkMode: ToggleDarkMode;
    setDarkMode: SetDarkMode;
  }

  /*
   * Items
   */

  export type Item = {
    _id?: string;
    id: string;
    name: string;
    checked: boolean;
    importance: number;
    note: string;
  };

  export type ItemState = {
    items: Item[];
    error: null | string;
    loading: boolean;
  };

  export interface ItemContext extends ItemState {
    getItems: (listId: string) => void;
    setItems: (items: Item[], listId: string) => void;
    pushItem: ({ name: string }, listId: string) => void;
    addItem: (item: Item, listId: string) => void;
    editItem: (item: Item) => void;
    pushEditItem: (item: Item) => void;
    deleteItem: (itemId: string) => void;
    pushDeleteItem: (itemId: string) => void;
    sortItems: () => void;
    clearItems: () => void;
    clearErrors: () => void;
  }

  /*
   * List
   */

  export type List = {
    _id?: string;
    name: string;
    accessCode: string;
    id: string;
  };

  export interface ListState {
    lists: List[];
    currentList: null | List;
    error: null | string;
    loading: boolean;
    hidden: boolean;
  }

  export interface ListContext extends ListState {
    getLists: () => void;
    setLists: (lists: List[]) => void;
    addList: (list: List) => void;
    deleteList: (id: string) => void;
    setCurrentList: (list: List) => void;
    clearCurrentList: () => void;
    clearLists: () => void;
    clearErrors: () => void;
    toggleHidden: () => void;
    setHidden: (hidden: boolean) => void;
  }

  /*
   *Alerts
   */

  export interface Alert {
    msg: string;
    type: string;
    id: string;
  }

  export type Alerts = Alert[];

  export type AddAlert = (
    msg: string,
    type: "primary" | "light" | "dark" | "danger" | "success" | "white",
    timeout?: number
  ) => void;

  export type RemoveAlert = (id: string) => void;

  export type ClearAlerts = () => void;

  export interface AlertContext extends Alerts {
    alerts: Alerts;
    addAlert: AddAlert;
    removeAlert: RemoveAlert;
    clearAlerts: ClearAlerts;
  }

  /*
   * Auth
   */

  export interface AuthState {
    token: null | string;
    isAuthenticated: null | boolean;
    loading: boolean;
    user: any;
    error: null | string;
  }

  export interface AuthContext extends AuthState {
    register: (formData: { name: string; email: string; password: string }) => void;
    login: (formData: { email: string; password: string }) => void;
    setLoading: (loading: boolean) => void;
    loadUser: () => void;
    logout: (msg?: string) => void;
    clearErrors: () => void;
  }
}
