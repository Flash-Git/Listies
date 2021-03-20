import { useContext } from "react";
import { Route, Redirect, RouteComponentProps } from "react-router-dom";

import AuthContext from "../../context/auth/AuthContext";

import { AuthContext as IAuthContext } from "context";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const authContext: IAuthContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  const nextComponent = (props: RouteComponentProps) => {
    if (!isAuthenticated && !loading) {
      return <Redirect to="/login" />;
    } else return <Component {...props} />;
  };

  return <Route {...rest} render={(props: RouteComponentProps) => nextComponent(props)} />;
};

export default PrivateRoute;
