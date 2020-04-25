import React, { FC, useContext, Fragment } from "react";

import ItemContext from "../../context/item/ItemContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  currentList: { name: string };
}

const Exporter: FC<Props> = ({ currentList }) => {
  const itemContext = useContext(ItemContext);
  const { items } = itemContext;

  const exportList = () => {
    const printObj = currentList.name + ":\n" + JSON.stringify(items, null, 2);

    const element = document.createElement("a");
    const file = new Blob([printObj], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element);
    element.click();
  };

  return currentList ? (
    <button
      className="btn btn-link m-2"
      style={{ float: "right", height: "2.4rem", color: "#003699" }}
      onClick={exportList}
    >
      <FontAwesomeIcon style={{ height: "100%" }} icon={["fas", "download"]} />
    </button>
  ) : (
    <Fragment></Fragment>
  );
};

export default Exporter;
