declare module "context" {
  import { AxiosError } from "axios";
  export interface Action {
    payload?: any;
    type: string;
  }

  export type HandleForbidden = (e: AxiosError) => void;

  /*
   * App
   */

  export type InitialiseSocket = () => void;
  export type CloseSocket = () => void;
  export type ClearSocket = () => void;
  export type SetSocket = (socket: SocketIOClient.Socket) => void;
  export type IdentifySelf = (user: User) => void;
  export type UpdateSocketList = (listId: string) => void;
  export type ResetSocket = () => void;
  export type ToggleDarkMode = () => void;
  export type SetDarkMode = (darkMode: boolean) => void;

  export interface AppState {
    socket: SocketIOClient.Socket | null;
    darkMode: boolean;
    identifed: boolean;
  }

  export interface AppContext extends AppState {
    initialiseSocket: InitialiseSocket;
    closeSocket: CloseSocket;
    clearSocket: ClearSocket;
    setSocket: SetSocket;
    identifySelf: IdentifySelf;
    updateSocketList: UpdateSocketList;
    resetSocket: ResetSocket;
    toggleDarkMode: ToggleDarkMode;
    setDarkMode: SetDarkMode;
  }

  /*
   * Items
   */

  export interface Item {
    _id?: string;
    id: string;
    name: string;
    checked: boolean;
    importance: number;
    note: string;
  }
  export type Items = Item[];

  export interface ItemState {
    items: Items;
    error: null | string;
    loading: boolean;
  }

  export type GetItems = (listId: string) => void;
  export type SetItems = (items: Item[], listId: string) => void;
  export type PushItem = ({ name: string }, listId: string) => void;
  export type AddItem = (item: Item, listId: string) => void;
  export type EditItem = (item: Item) => void;
  export type PushEditItem = (item: Item) => void;
  export type DeleteItem = (itemId: string) => void;
  export type PushDeleteItem = (itemId: string) => void;
  export type SortItems = () => void;
  export type ClearItems = () => void;
  export type ClearErrors = () => void;

  export interface ItemContext extends ItemState {
    getItems: GetItems;
    setItems: SetItems;
    pushItem: PushItem;
    addItem: AddItem;
    editItem: EditItem;
    pushEditItem: PushEditItem;
    deleteItem: DeleteItem;
    pushDeleteItem: PushDeleteItem;
    sortItems: SortItems;
    clearItems: ClearItems;
    clearErrors: ClearErrors;
  }

  /*
   * List
   */

  export interface List {
    _id?: string;
    id: string;
    owner: string;
    name: string;
    private: boolean;
    accessId: string;
    password: string;
    users: string[];
    date: number;
  }
  export type Lists = List[];

  export interface ListState {
    lists: Lists;
    currentList: null | List;
    error: null | string;
    loading: boolean;
    hidden: boolean;
  }

  export type GetLists = () => void;
  export type SetLists = (lists: Lists) => void;
  export type ConnectList = (accessId: string, password: string) => void;
  export type AddList = (list: List) => void;
  export type DeleteList = (id: string) => void;
  export type SetCurrentList = (list: List) => void;
  export type ClearCurrentList = () => void;
  export type ClearLists = () => void;
  export type ClearErrors = () => void;
  export type ToggleHidden = () => void;
  export type SetHidden = (hidden: boolean) => void;

  export interface ListContext extends ListState {
    getLists: GetLists;
    setLists: SetLists;
    pushList: AddList;
    connectList: ConnectList;
    addList: AddList;
    pushDeleteList: DeleteList;
    deleteList: DeleteList;
    setCurrentList: SetCurrentList;
    clearCurrentList: ClearCurrentList;
    clearLists: ClearLists;
    clearErrors: ClearErrors;
    toggleHidden: ToggleHidden;
    setHidden: SetHidden;
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

  export interface User {
    _id: string;
    name: string;
    email: string;
    date: string;
  }

  export interface AuthState {
    token: null | string;
    isAuthenticated: null | boolean;
    loading: boolean;
    user: User | null;
    error: null | string;
  }

  export type Register = (formData: { name: string; email: string; password: string }) => void;
  export type Login = (formData: { email: string; password: string }) => void;
  export type SendVerificationEmail = (email: string) => void;
  export type SetLoading = (loading: boolean) => void;
  export type LoadUser = () => void;
  export type Logout = (msg?: string) => void;
  export type ClearErrors = () => void;

  export interface AuthContext extends AuthState {
    register: Register;
    login: Login;
    sendVerificationEmail: SendVerificationEmail;
    setLoading: SetLoading;
    loadUser: LoadUser;
    logout: Logout;
    clearErrors: ClearErrors;
  }
}
