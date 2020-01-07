import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

import ItemContext from "../../context/item/ItemContext";
import AlertContext from "../../context/alert/AlertContext";

const ItemForm: any = ({ currentList }: any) => {
  const itemContext = useContext(ItemContext);
  const { error, addItem, clearErrors } = itemContext;

  const alertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  // List
  const [listId, setListId] = useState("");
  const [listName, setListName] = useState("No List Selected");

  useEffect(() => {
    setListId(currentList ? currentList.id : "");
    setListName(currentList ? currentList.name : "No List Selected");
  }, [currentList]);

  const emptyItem = {
    name: ""
  };

  const [item, setItem] = useState(emptyItem);
  const { name } = item;

  useEffect(() => {
    if (!error) return;
    addAlert(error, "danger");
    clearErrors();
    //eslint-disable-next-line
  }, [error]);

  //Input
  const onChange = (e: any) =>
    setItem({ ...item, [e.target.name]: e.target.value });

  const onSubmit = (e: any) => {
    e.preventDefault();

    addItem(item, listId);
    clearAll();
  };

  const clearAll = () => {
    setItem(emptyItem);
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
          maxWidth: "6rem",
          margin: "0",
          marginBottom: "0.7rem",
          padding: "0.1rem"
        }}
        type="submit"
        value={"Add Item"}
        className="btn btn-primary btn-block"
      />
    </form>
  );

  // Render
  return (
    <div className="grow-shrink">
      <h2 className="text-primary">{listName}</h2>
      {currentList && inputFields()}
    </div>
  );
};

ItemForm.propTypes = {
  currentList: PropTypes.object
};

export default ItemForm;
