import React, { Fragment, useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListContext from "../../context/list/ListContext";
import AlertContext from "../../context/alert/AlertContext";

const ListForm = () => {
  const listContext = useContext(ListContext);
  const alertContext = useContext(AlertContext);

  const {
    error,
    addList,
    clearCurrentList, //todo
    clearErrors,
    hidden,
    toggleHidden
  } = listContext;

  const { setAlert } = alertContext;

  const emptyList = {
    name: ""
  };

  const [list, setList] = useState(emptyList);
  const { name } = list;

  useEffect(() => {
    if (error) {
      setAlert(error, "danger");
      clearErrors();
    }
    //eslint-disable-next-line
  }, [error]);

  //Input
  const onChange = (e: any) =>
    setList({ ...list, [e.target.name]: e.target.value });

  const onSubmit = (e: any) => {
    e.preventDefault();

    addList(list);
    //setcurrentlist
    clearAll();
  };

  const clearAll = () => {
    setList(emptyList);
    clearCurrentList();
  };

  const toggleList = () => {
    toggleHidden();
  };

  // Render
  return (
    <Fragment>
      <button
        onClick={toggleList}
        className="btn btn-sm btn-primary mx"
        style={{ position: "absolute" }}
      >
        <FontAwesomeIcon icon={["fas", "bars"]} />
      </button>
      {!hidden && (
        <div className="container">
          <form onSubmit={onSubmit}>
            <h2 className="text-primary">Add New List</h2>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={onChange}
            />
            <input
              type="submit"
              value="Add New List"
              className="btn btn-primary btn-block"
            />
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default ListForm;
