export interface IAction {
  payload?: any;
  type: string;
}

export type IAlert = {
  msg: string;
  type: string;
  id: string;
};

export type IAlerts = IAlert[];

export interface AddAlert {
  (
    msg: string,
    type: "primary" | "light" | "dark" | "danger" | "success" | "white",
    timeout?: number
  ): void;
}
