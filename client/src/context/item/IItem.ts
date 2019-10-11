export type IItem = {
  _id?: string;
  id: undefined | string;
  name: string;
  checked: boolean;
  importance: number;
  note: string;
};

export type IState = {
  items: IItem[];
  error: null | string;
  loading: boolean;
};

export interface IAction {
  payload?: any;
  type: string;
}
