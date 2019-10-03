import React, { useState, useContext, useEffect } from "react";

import AlertContext from "../../context/alert/AlertContext";
import AuthContext from "../../context/auth/AuthContext";

const Register: React.FC = ({ history }: any) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  const { isAuthenticated, error, register, clearErrors } = authContext;

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = user;

  useEffect(() => {
    isAuthenticated && history.push("/");

    if (error) {
      setAlert(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, history]);

  const onChange = (e: { target: { name: any; value: any } }) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      setAlert("Please enter all fields", "danger");
    } else if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else if (password.length < 7) {
      setAlert("Passwords must be at least 7 characters long", "danger");
    } else if (!email.includes("@")) {
      setAlert("Emails must be valid", "danger");
    } else {
      if (password.length > 72)
        setAlert(
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
          <input type="text" name="name" value={name} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="name">Email Address</label>
          <input type="text" name="email" value={email} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
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
            // minLength="7"
          />
        </div>
        <input
          type="submit"
          value="Register"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Register;
