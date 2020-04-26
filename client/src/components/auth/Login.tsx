import React, { FC, useState, useContext, useEffect } from "react";

import AlertContext from "../../context/alert/AlertContext";
import AuthContext from "../../context/auth/AuthContext";
import ListContext from "../../context/list/ListContext";

import {
  AuthContext as IAuthContext,
  AlertContext as IAlertContext,
  ListContext as IListContext,
} from "context";

interface Props {
  history: any;
}

const Login: FC<Props> = ({ history }) => {
  const alertContext: IAlertContext = useContext(AlertContext);
  const authContext: IAuthContext = useContext(AuthContext);
  const listContext: IListContext = useContext(ListContext);

  const { addAlert, clearAlerts } = alertContext;
  const { isAuthenticated, error, login, clearErrors } = authContext;
  const { clearCurrentList } = listContext;

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  useEffect(() => {
    isAuthenticated && history.push("/");
    clearCurrentList();
    clearAlerts();

    //eslint-disable-next-line
  }, [isAuthenticated, history]);

  useEffect(() => {
    if (error) {
      addAlert(error, "danger");
      clearErrors();
    }

    //eslint-disable-next-line
  }, [error]);

  const onChange = (e: { target: { name: string; value: string } }) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (email === "" || password === "") {
      addAlert("Please fill in all fields", "danger");
    } else {
      login({
        email,
        password,
      });
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <input
          type="submit"
          value="Login"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Login;
