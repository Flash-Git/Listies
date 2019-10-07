import React, { useContext } from "react";
import PropTypes from "prop-types";

import ListContext from "../../context/list/ListContext";

const ListItem: any = ({ list }: any) => {
  const listContext = useContext(ListContext);
  const {
    currentList,
    deleteList,
    setCurrentList,
    clearCurrentList
  } = listContext;

  const { id, name } = list;

  const onDelete = () => {
    if (currentList && currentList.id === list.id) clearCurrentList();
    deleteList(id);
  };

  const onEdit = () => setCurrentList(list);

  return (
    <div
      className="card bg-light grow-shrink"
      style={{
        display: "flex",
        alignItems: "center"
      }}
    >
      <button
        className="btn btn-discreet text-left px"
        onClick={onEdit}
        style={{ flexGrow: 1 }}
      >
        <h3 className="text-left">{name}</h3>
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

ListItem.propTypes = {
  list: PropTypes.object.isRequired
};

export default ListItem;
