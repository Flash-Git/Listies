export type IAlert = {
  msg: string;
  type: string;
  id: string;
};

export type IAlerts = IAlert[];

export interface IAction {
  payload?: any;
  type: string;
}
