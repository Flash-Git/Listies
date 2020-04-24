declare module "context" {
  export type Action = {
    payload?: any;
    type: string;
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

  export type ClearAlerts = () => void;

  export interface AlertContext extends Alerts {
    addAlert: AddAlert;
    clearAlerts: ClearAlerts;
  }
}
