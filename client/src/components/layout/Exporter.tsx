import React, { FC, useContext, Fragment } from "react";

import ItemContext from "../../context/item/ItemContext";

interface Props {
  currentList: { name: string };
}

const Exporter: FC<Props> = ({ currentList }) => {
  const itemContext = useContext(ItemContext);
  const { items } = itemContext;

  const exportList = () => {
    const printObj = currentList.name + ":\n" + JSON.stringify(items, null, 2);
    console.log(printObj);
  };

  return currentList ? (
    <button onClick={exportList}>EXPORT</button>
  ) : (
    <Fragment></Fragment>
  );
};

export default Exporter;
