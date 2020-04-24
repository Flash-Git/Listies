import React, { useState, useContext, useEffect, FC } from "react";

import AlertContext from "../../context/alert/AlertContext";
import ListContext from "../../context/list/ListContext";

const ListForm: FC = () => {
  const alertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  const listContext = useContext(ListContext);
  const { error, addList, clearCurrentList, clearErrors } = listContext;

  useEffect(() => {
    if (!error) return;
    addAlert(error, "danger");
    clearErrors();
    //eslint-disable-next-line
  }, [error]);

  const emptyList = {
    name: "",
  };

  const [list, setList] = useState(emptyList);
  const { name } = list;

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
        marginTop: "0.7rem",
        marginBottom: "0.7rem",
      }}
    >
      <input
        style={{
          minWidth: "5rem",
          maxWidth: "15rem",
          margin: "0",
          marginBottom: "0.7rem",
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
          marginBottom: "0.7rem",
          padding: "0.1rem",
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
