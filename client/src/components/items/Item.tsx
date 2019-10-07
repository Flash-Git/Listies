import React, { useContext } from "react";
import PropTypes from "prop-types";

import ItemContext from "../../context/item/ItemContext";

const Item: any = ({ item }: any) => {
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
          backgroundColor
        }}
      ></button>
    );
  };

  return (
    <div
      className="card bg-light grow-shrink"
      style={{
        display: "flex",
        alignItems: "center"
      }}
    >
      {importanceButton()}
      <input
        style={{
          transform: "scale(1.5)"
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
        <h3 className="text-primary text-left">{name}</h3>
      </button>
      <div style={{ marginLeft: "auto" }}>
        <button
          className="btn btn-danger mx"
          onClick={onDelete}
          style={{ fontSize: "0.85rem", padding: "0.15rem 0.7rem" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired
};

export default Item;
