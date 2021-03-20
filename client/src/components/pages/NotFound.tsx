import { FC, useContext } from "react";

import { useMountEffect } from "../../functions/hooks";

import AuthContext from "../../context/auth/AuthContext";

import { AuthContext as IAuthContext } from "context";

const NotFound: FC = () => {
  const authContext: IAuthContext = useContext(AuthContext);
  const { setLoading } = authContext;

  useMountEffect(() => {
    setLoading(true);
  });

  return (
    <div className="container">
      <h1>Not Found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
