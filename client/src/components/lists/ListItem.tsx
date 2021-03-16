import React, { useContext, FC } from "react";

import ListContext from "../../context/list/ListContext";
import { List, ListContext as IListContext } from "context";

interface Props {
  list: List;
}

const ListItem: FC<Props> = ({ list }) => {
  const listContext: IListContext = useContext(ListContext);
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

  const onSelect = () => setCurrentList(list);

  return (
    <div
      className="card bg-light grow-shrink my"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.7rem",
        boxShadow: "0 0 2px 0px rgba(0,0,0,0.35)",
      }}
    >
      <button
        className="btn btn-discreet text-left px"
        onClick={onSelect}
        style={{ flexGrow: 1 }}
      >
        <h3 className="text-left">{name}</h3>
      </button>
      <div>
        <button
          className="btn btn-danger mx"
          onClick={onDelete}
          style={{
            fontSize: "0.85rem",
            padding: "0.15rem 0.7rem",
            marginLeft: "0.5rem",
            alignSelf: "flex-end",
            justifySelf: "center",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ListItem;
