import React, { Fragment, useContext, useEffect, useState } from "react";

import Lists from "../lists/Lists";

import AuthContext from "../../context/auth/AuthContext";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  const [loaded, setLoaded] = useState(false);

  const useLoad = () => {
    useEffect(() => {
      !loaded && setLoaded(true) && loadUser();
    }, []);
  };

  useLoad();

  return <Lists />;
};

export default Home;
