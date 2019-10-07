import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const { hidden, toggleHidden, currentList } = listContext;

  const [loaded, setLoaded] = useState(false);

  const useLoad = () => {
    useEffect(() => {
      if (loaded) return;

      setLoaded(true);
      loadUser();
    }, []);
  };
  useLoad();

  const toggleList = () => {
    toggleHidden();
  };

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
      <button
        onClick={toggleList}
        className="btn btn-sm btn-primary mx"
        style={{
          position: "absolute",
          left: "1rem",
          paddingLeft: "0.8rem",
          paddingRight: "0.8rem"
        }}
      >
        <FontAwesomeIcon icon={["fas", "bars"]} />
      </button>
      {!hidden && (
        <div className="px-2 mbot-2">
          <ListForm />
          <Lists />
        </div>
      )}
      <div
        className="px-2 mx-auto mbot-4"
        style={{
          maxHeight: "40rem",
          overflowY: "auto",
          scrollbarWidth: "thin"
        }}
      >
        <ItemForm listId={listId} listName={listName} />
        <Items listId={listId} listName={listName} />
      </div>
    </div>
  );
};

export default Home;
