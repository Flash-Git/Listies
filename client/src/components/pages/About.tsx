import { FC, useContext } from "react";

import { useMountEffect } from "../../functions/hooks";

import AuthContext from "../../context/auth/AuthContext";

import { AuthContext as IAuthContext } from "context";

const About: FC = () => {
  const authContext: IAuthContext = useContext(AuthContext);
  const { setLoading } = authContext;

  useMountEffect(() => {
    setLoading(true);
  });

  return (
    <div className="container">
      <h1>About</h1>
      <p className="my-1">Full stack React app</p>
      <p className="bg-dark p">
        <strong>Version: </strong> 1.1.0
      </p>
    </div>
  );
};

export default About;
