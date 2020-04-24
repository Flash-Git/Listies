import React, { useContext, FC } from "react";

import ItemContext from "../../context/item/ItemContext";
import { Item as IItem } from "context";

interface Props {
  item: IItem;
}

const Item: FC<Props> = ({ item }) => {
  const itemContext = useContext(ItemContext);
  const { editItem, deleteItem } = itemContext;

  const { id, name, checked, importance } = item;

  const toggleCheck = () => {
    editItem({ ...item, checked: !checked });
  };

  const incrementImportance = () => {
    editItem({ ...item, importance: (importance + 1) % 3 });
  };

  const onDelete = () => {
    deleteItem(id);
  };

  const importanceButton = () => {
    let backgroundColor = "";
    switch (importance) {
      case 0:
        backgroundColor = "yellow";
        break;
      case 1:
        backgroundColor = "orange";
        break;
      case 2:
        backgroundColor = "red";
        break;
      default:
        backgroundColor = "white";
    }
    return (
      <button
        onClick={incrementImportance}
        className="btn-importance"
        style={{
          backgroundColor,
        }}
      ></button>
    );
  };

  return (
    <div
      className="card bg-light grow-shrink"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {importanceButton()}
      <input
        style={{
          transform: "scale(1.4)",
        }}
        className="mx-1"
        type="checkbox"
        onChange={toggleCheck}
        checked={checked}
      />
      <button
        className="btn btn-discreet text-left"
        onClick={incrementImportance}
        style={{ flexGrow: 1 }}
      >
        <h3 className="text-primary text-left" style={{ fontSize: "90%" }}>
          {name}
        </h3>
      </button>
      <div style={{ marginLeft: "auto" }}>
        <button
          className="btn btn-danger mx"
          onClick={onDelete}
          style={{
            fontSize: "0.8rem",
            padding: "0.1rem 0.6rem",
            marginRight: "0",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Item;
