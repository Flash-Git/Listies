import React, { useState, useContext, useEffect, Fragment } from "react";
import PropTypes from "prop-types";

import ItemContext from "../../context/item/ItemContext";
import AlertContext from "../../context/alert/AlertContext";

const ItemForm: any = ({ listId, listName }: any) => {
  const itemContext = useContext(ItemContext);
  const alertContext = useContext(AlertContext);

  const { error, addItem, clearErrors } = itemContext;

  const { setAlert } = alertContext;

  const emptyItem = {
    name: ""
  };

  const [item, setItem] = useState(emptyItem);
  const { name } = item;

  useEffect(() => {
    if (error) {
      setAlert(error, "danger");
      clearErrors();
    }
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
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        type="submit"
        value={"Add Item"}
        className="btn btn-primary btn-block"
      />
    </form>
  );

  // Render
  return (
    <div style={{ width: "26rem" }}>
      <h2 className="text-primary">{listName}</h2>
      {listId && inputFields()}
    </div>
  );
};

ItemForm.propTypes = {
  listName: PropTypes.string,
  listId: PropTypes.string
};

export default ItemForm;
