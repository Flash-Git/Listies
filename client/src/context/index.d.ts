declare module "context" {
  export type Action = {
    payload?: any;
    type: string;
  };

  /*
   * App
   */

  export type App = {};

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
    items: IItem[];
    error: null | string;
    loading: boolean;
  };

  export interface ItemContext extends ItemState {
    getItems: (listId: string) => void;
    setItems: (items: Item[], listId: string) => void;
    addItem: (item: Item, listId: string) => void;
    editItem: (item: Item) => void;
    deleteItem: (itemId: string) => void;
    clearItems: () => void;
    clearErrors: () => void;
  }

  /*
   * List
   */

  export type List = {
    _id?: string;
    name: string;
    id: string;
  };

  export type ListState = {
    lists: IList[];
    currentList: null | IList;
    error: null | string;
    loading: boolean;
    hidden: boolean;
  };

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

  export type Alert = {
    msg: string;
    type: string;
    id: string;
  };

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

  export type AuthState = {
    token: null | string;
    isAuthenticated: null | boolean;
    loading: boolean;
    user: any;
    error: null | string;
  };

  export interface AuthContext extends AuthState {
    register: (formData: {
      name: string;
      email: string;
      password: string;
    }) => void;
    loadUser: () => void;
    login: (formData: { email: string; password: string }) => void;
    logout: () => void;
    clearErrors: () => void;
  }
}
