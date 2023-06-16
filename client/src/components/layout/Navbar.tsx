import { FC, Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import AuthContext from "../../context/auth/AuthContext";

import { AuthContext as IAuthContext } from "context";

import { useMountEffect } from "../../functions/hooks";

interface Props {
  title: string;
  icon: IconProp;
}

const Navbar: FC<Props> = ({ title, icon }) => {
  const authContext: IAuthContext = useContext(AuthContext);

  const { isAuthenticated, user, logout, loadUser } = authContext;

  useMountEffect(() => {
    loadUser();
  });

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <Fragment>
      <li className="mx-1 sm-left">
        Hello <strong>{user && user.name}</strong>
      </li>
      <li>
        <Link className="nav-link nav-link-fade" to="/">
          Home
        </Link>
      </li>
      <li>
        <Link className="nav-link nav-link-fade" to="/about">
          About
        </Link>
      </li>
      <li>
        <a className="nav-link nav-link-fade" onClick={onLogout} href="#!">
          <FontAwesomeIcon icon={["fas", "sign-out-alt"]} />
          <span className="hide-sm">&nbsp; Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link className="nav-link nav-link-fade" to="/about">
          About
        </Link>
      </li>
      <li>
        <Link className="nav-link nav-link-fade" to="/login">
          Login
        </Link>
      </li>
      <li>
        <Link className="nav-link nav-link-fade" to="/register">
          Register
        </Link>
      </li>
    </Fragment>
  );

  return (
    <nav className="navbar bg-primary">
      <h1 className="hide-sm">
        <Link to="/">
          <FontAwesomeIcon icon={icon} /> {title}
        </Link>
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </nav>
  );
};

export default Navbar;
