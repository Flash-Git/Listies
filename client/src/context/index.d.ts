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
    id: undefined | string;
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

  /*
   * List
   */

  export type List = {
    _id?: string;
    name: string;
    id: undefined | string;
  };

  export type ListState = {
    lists: IList[];
    currentList: null | IList;
    error: null | string;
    loading: boolean;
    hidden: boolean;
  };

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

  export interface Auth {
    token: null | string;
    isAuthenticated: null | boolean;
    loading: boolean;
    user: any;
    error: null | string;
  }
}
