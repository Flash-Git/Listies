export interface IState {
  token: null | string;
  isAuthenticated: null | boolean;
  loading: boolean;
  user: any;
  error: null | string;
}

export interface IAction {
  payload?: any;
  type: string;
}
