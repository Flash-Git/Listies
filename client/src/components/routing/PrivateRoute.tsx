import { FC, ReactNode, useContext } from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";

import AuthContext from "../../context/auth/AuthContext";

import { AuthContext as IAuthContext } from "context";

interface Props {
  children: JSX.Element;
  redirectTo: string;
}

const PrivateRoute: FC<Props> = ({ children, redirectTo }) => {
  const authContext: IAuthContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  return isAuthenticated && !loading ? children : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
