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
    <div className="card bg-light">
      <h3 className="text-primary text-left">{name}</h3>
      <button className="bt btn-dark btn-sm" onClick={onEdit}>
        Edit
      </button>
      <button className="bt btn-danger btn-sm" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

ListItem.propTypes = {
  list: PropTypes.object.isRequired
};

export default ListItem;
