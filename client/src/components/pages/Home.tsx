import React, { FC, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Lists from "../lists/Lists";
import ListForm from "../lists/ListForm";
import Items from "../items/Items";
import ItemForm from "../items/ItemForm";

import AuthContext from "../../context/auth/AuthContext";
import ListContext from "../../context/list/ListContext";

const Home: FC = () => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  const listContext = useContext(ListContext);
  const { hidden, toggleHidden, currentList } = listContext;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    setLoaded(true);
    loadUser();
  }, [loaded, setLoaded, loadUser]);

  const toggleList = () => {
    toggleHidden();
  };

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
        <div
          className="px-1 mbot-2"
          style={{
            maxHeight: "40rem",
            overflowY: "auto",
            scrollbarWidth: "thin",
            flexBasis: "23rem",
            maxWidth: "30rem"
          }}
        >
          <ListForm />
          <Lists />
        </div>
      )}
      <div
        className="px-1 mx-auto mbot-4"
        style={{
          // maxHeight: "60rem",
          overflowY: "auto",
          scrollbarWidth: "thin",
          flexBasis: "23rem",
          maxWidth: "30rem"
        }}
      >
        <ItemForm currentList={currentList} />
        <Items currentList={currentList} />
      </div>
    </div>
  );
};

export default Home;
