import React, { useContext, useEffect, useState } from "react";

import Lists from "../lists/Lists";
import ListForm from "../lists/ListForm";
import Items from "../items/Items";
import ItemForm from "../items/ItemForm";

import AuthContext from "../../context/auth/AuthContext";
import ListContext from "../../context/list/ListContext";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  const listContext = useContext(ListContext);
  const { currentList } = listContext;

  const [loaded, setLoaded] = useState(false);

  const useLoad = () => {
    useEffect(() => {
      if (loaded) return;

      setLoaded(true);
      loadUser();
    }, []);
  };
  useLoad();

  const listId = currentList ? currentList.id : "";
  const listName = currentList ? currentList.name : "No List Selected";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        marginTop: "0.7rem"
      }}
    >
      <div style={{ justifySelf: "flex-start" }}>
        <ListForm />
        <Lists />
      </div>
      <div style={{ margin: "0 auto", padding: "0 2rem" }}>
        <ItemForm listId={listId} listName={listName} />
        <Items listId={listId} listName={listName} />
      </div>
    </div>
  );
};

export default Home;
