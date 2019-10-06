export type IItem = {
  _id?: string;
  id: undefined | string;
  msg: string;
  checked: boolean;
  importance: number;
  note: string;
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
