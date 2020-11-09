import React, { useState, useContext, useEffect, FC } from "react";

import AlertContext from "../../context/alert/AlertContext";
import ListContext from "../../context/list/ListContext";
import { List, AlertContext as IAlertContext, ListContext as IListContext } from "context";

const ListForm: FC = () => {
  const alertContext: IAlertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  const listContext: IListContext = useContext(ListContext);
  const { error, addList, clearCurrentList, clearErrors } = listContext;

  useEffect(() => {
    if (!error) return;
    addAlert(error, "danger");
    clearErrors();
    //eslint-disable-next-line
  }, [error]);

  const emptyList: List = {
    name: "",
    accessCode: "",
    id: ""
  };

  const [toggled, setToggled] = useState(false);

  const [list, setList] = useState(emptyList);

  const { name, accessCode } = list;

  const toggleForm = () => {
    setToggled(toggled => !toggled);
  };

  //Input
  const onChange = (e: any) =>
    setList({ ...list, [e.target.name]: e.target.value });

  const onSubmit = (e: any) => {
    e.preventDefault();

    addList({ ...list, name: name.trim() });
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
        marginBottom: "0.7rem"
      }}
    >
      <input
        style={{
          minWidth: "5rem",
          maxWidth: "15rem",
          margin: "0",
          marginBottom: "0.7rem"
        }}
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        style={{
          minWidth: "5rem",
          maxWidth: "15rem",
          margin: "0",
          marginBottom: "0.7rem"
        }}
        type="text"
        placeholder="Access Code"
        name="accessCode"
        value={accessCode}
        onChange={onChange}
      />
      <input
        style={{
          maxWidth: "8.5rem",
          margin: "0",
          marginBottom: "0.7rem",
          padding: "0.1rem"
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
      <h2 onClick={toggleForm} className="text-primary">
        {toggled ? "Add Existing List" : "Add New List"}
      </h2>
      {inputFields()}
    </div>
  );
};

export default ListForm;
