import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="card bg-light" style={{ width: "20rem" }}>
      <h3 className="text-left">
        <button
          className="btn btn-discreet text-left"
          onClick={onEdit}
          style={{ minWidth: "12rem" }}
        >
          {name}
        </button>
        <div style={{ float: "right" }}>
          <button
            className="btn btn-danger"
            onClick={onDelete}
            style={{
              fontSize: "0.8rem",
              padding: "0.2rem 0.8rem",
              margin: "0"
            }}
          >
            Delete
          </button>
        </div>
      </h3>
    </div>
  );
};

ListItem.propTypes = {
  list: PropTypes.object.isRequired
};

export default ListItem;
