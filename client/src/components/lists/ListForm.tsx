import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListContext from "../../context/list/ListContext";
import AlertContext from "../../context/alert/AlertContext";

const ListForm = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const listContext = useContext(ListContext);
  const {
    error,
    addList,
    clearCurrentList, //todo
    clearErrors
  } = listContext;

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

  const inputFields = () => (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "1rem",
        marginBottom: "1rem"
      }}
    >
      <input
        style={{
          minWidth: "5rem",
          maxWidth: "15rem",
          margin: "0",
          marginBottom: "1rem"
        }}
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        style={{
          maxWidth: "8.5rem",
          margin: "0",
          marginBottom: "1rem"
        }}
        type="submit"
        value="Add New List"
        className="btn btn-primary btn-block"
      />
    </form>
  );

  // Render
  return (
    <div className="grow-shrink">
      <h2 className="text-primary">Add New List</h2>
      {inputFields()}
    </div>
  );
};

export default ListForm;
