import React, { useContext, FC } from "react";

import ListContext from "../../context/list/ListContext";
import { List } from "context";

interface Props {
  list: List;
}

const ListItem: FC<Props> = ({ list }) => {
  const listContext = useContext(ListContext);
  const {
    currentList,
    deleteList,
    setCurrentList,
    clearCurrentList,
  } = listContext;

  const { id, name } = list;

  const onDelete = () => {
    if (currentList && currentList.id === list.id) clearCurrentList();
    deleteList(id);
  };

  const onEdit = () => setCurrentList(list);

  return (
    <div
      className="card bg-light grow-shrink my"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.7rem",
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
          style={{
            fontSize: "0.85rem",
            padding: "0.15rem 0.7rem",
            marginRight: "0",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ListItem;
