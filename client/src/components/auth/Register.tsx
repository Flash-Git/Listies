import { FC, useState, useContext, useEffect, ChangeEvent, FormEvent } from "react";

import AlertContext from "../../context/alert/AlertContext";
import AuthContext from "../../context/auth/AuthContext";

import { AuthContext as IAuthContext, AlertContext as IAlertContext } from "context";

interface Props {
  history: any;
}

const Register: FC<Props> = ({ history }) => {
  const alertContext: IAlertContext = useContext(AlertContext);
  const authContext: IAuthContext = useContext(AuthContext);

  const { addAlert, clearAlerts } = alertContext;
  const { isAuthenticated, error, register, clearErrors } = authContext;

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = user;

  useEffect(() => {
    if (!isAuthenticated) return;
    clearAlerts();
    history.push("/");

    // eslint-disable-next-line
  }, [isAuthenticated, history]);

  useEffect(() => {
    if (!error) return;
    if (error === "Verification email sent") {
      addAlert(error, "primary");
      clearErrors();
      return;
    }
    addAlert(error, "danger");
    clearErrors();

    // eslint-disable-next-line
  }, [error]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      addAlert("Please enter all fields", "danger");
    } else if (password !== password2) {
      addAlert("Passwords do not match", "danger");
    } else if (password.length < 7) {
      addAlert("Passwords must be at least 7 characters long", "danger");
    } else if (!email.includes("@")) {
      addAlert("Emails must be valid", "danger");
    } else {
      if (password.length > 72)
        addAlert(
          `The server will only use the first 72 characters of your ${password.length} character password`,
          "dark",
          30000
        );
      register({ name, email, password });
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            autoComplete="name"
            autoFocus
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Email Address</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={onChange}
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            autoComplete="new-password"
            required
            // minLength="7"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            autoComplete="new-password"
            required
            // minLength="7"
          />
        </div>
        <input type="submit" value="Register" className="btn btn-primary btn-block" />
      </form>
    </div>
  );
};

export default Register;
