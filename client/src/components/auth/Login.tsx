import { FC, useState, useContext, useEffect } from "react";

import AlertContext from "../../context/alert/AlertContext";
import AuthContext from "../../context/auth/AuthContext";

import { AlertContext as IAlertContext, AuthContext as IAuthContext } from "context";

interface Props {
  history: any;
}

const Login: FC<Props> = ({ history }) => {
  const alertContext: IAlertContext = useContext(AlertContext);
  const { addAlert, clearAlerts } = alertContext;

  const authContext: IAuthContext = useContext(AuthContext);
  const { isAuthenticated, error, login, sendVerificationEmail, clearErrors } = authContext;

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [needsVerfication, setNeedsVerification] = useState(false);

  const { email, password } = user;

  useEffect(() => {
    if (!isAuthenticated) return;
    clearAlerts();
    history.push("/");

    //eslint-disable-next-line
  }, [isAuthenticated, history]);

  useEffect(() => {
    if (!error) return;
    addAlert(error, "danger");
    if (error === "Email has not been verified") setNeedsVerification(true);

    clearErrors();

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

  const onVerify = () => {
    sendVerificationEmail(email);
    setNeedsVerification(false);
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
          <input type="password" name="password" value={password} onChange={onChange} />
        </div>
        <input type="submit" value="Login" className="btn btn-primary btn-block" />
      </form>
      {needsVerfication && (
        <button className="btn btn-primary btn-block" onClick={onVerify}>
          Resend Email
        </button>
      )}
    </div>
  );
};

export default Login;
