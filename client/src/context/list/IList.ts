export type IList = {
  _id?: string;
  name: string;
  id: undefined | string;
};

export type IState = {
  lists: IList[];
  currentList: null | IList;
  error: null | string;
  loading: boolean;
  hidden: boolean;
};

export interface IAction {
  payload?: any;
  type: string;
}
