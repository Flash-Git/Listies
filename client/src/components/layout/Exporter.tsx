import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Items, List } from "context";

interface Props {
  currentList: List;
  items: Items;
}

const Exporter: FC<Props> = ({ currentList, items }) => {
  const exportList = () => {
    // const printObj = currentList.name + ":\n" + JSON.stringify(items, null, 2);
    const printObj = currentList.name + ":\n" + items.map((item) => "\n" + item.name);

    const element = document.createElement("a");
    const file = new Blob([printObj], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${currentList.name}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <button
      className="btn btn-link"
      style={{ float: "right", height: "2.4rem" }}
      onClick={exportList}
    >
      <FontAwesomeIcon style={{ height: "100%" }} icon={["fas", "download"]} />
    </button>
  );
};

export default Exporter;
