import React, { Fragment, useContext, useEffect, useState } from "react";

import Lists from "../lists/Lists";
import ListForm from "../lists/ListForm";
import Items from "../items/Items";

import AuthContext from "../../context/auth/AuthContext";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  const [loaded, setLoaded] = useState(false);

  const useLoad = () => {
    useEffect(() => {
      if (loaded) return;

      setLoaded(true);
      loadUser();
    }, []);
  };

  useLoad();

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ListForm />
        <Lists />
      </div>
      <div>
        <Items />
      </div>
    </div>
  );
};

export default Home;
