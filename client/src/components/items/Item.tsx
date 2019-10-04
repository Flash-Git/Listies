import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import ItemContext from "../../context/item/ItemContext";

const Item: any = ({ item }: any) => {
  const itemContext = useContext(ItemContext);
  const { deleteItem } = itemContext;

  const { id, name } = item;

  const onDelete = () => {
    deleteItem(id);
  };

  return (
    <div className="card bg-light" style={{ width: "20rem" }}>
      <h3 className="text-primary text-left">
        {name}
        <div style={{ float: "right" }}>
          <button
            className="btn btn-danger mx"
            onClick={onDelete}
            style={{ fontSize: "0.8rem", padding: "0.2rem 0.8rem" }}
          >
            Delete
          </button>
        </div>
      </h3>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired
};

export default Item;
