import React, { useState, useContext, useEffect } from "react";

import ListContext from "../../context/list/ListContext";
import AlertContext from "../../context/alert/AlertContext";

const ListForm = () => {
  const listContext = useContext(ListContext);
  const alertContext = useContext(AlertContext);

  const {
    currentList,
    error,
    addList,
    clearCurrentList,
    clearErrors
  } = listContext;

  const { setAlert } = alertContext;

  const emptyList = {
    name: ""
  };

  const [list, setList] = useState(emptyList);
  const { name } = list;

  useEffect(() => {
    if (currentList !== null) {
      setList({ ...emptyList, ...currentList });
    } else {
      setList(emptyList);
    }
    //eslint-disable-next-line
  }, [currentList]);

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

    if (currentList === null) {
      addList(list);
    } else {
      //updateContact(contact);
    }
    clearAll();
  };

  const clearAll = () => {
    setList(emptyList);
    clearCurrentList();
  };

  //Render
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h2 className="text-primary">
          {currentList ? "Edit List" : "Add New List"}
        </h2>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={onChange}
        />
        <input
          type="submit"
          value={currentList ? "Edit List" : "Add New List"}
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default ListForm;
