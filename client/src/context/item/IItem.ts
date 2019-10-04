export type IItem = {
  _id?: string;
  msg: string;
  id: undefined | string;
};

export type IState = {
  list: null | string;
  items: IItem[];
  error: null | string;
  loading: boolean;
};

export interface IAction {
  payload?: any;
  type: string;
}
