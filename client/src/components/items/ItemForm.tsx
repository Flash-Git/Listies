import React, { useState, useContext, useEffect, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ItemContext from "../../context/item/ItemContext";
import AlertContext from "../../context/alert/AlertContext";
import Exporter from "../layout/Exporter";

import { List, ItemContext as IItemContext, AlertContext as IAlertContext } from "context";

interface Props {
  currentList: List;
}

const ItemForm: FC<Props> = ({ currentList }) => {
  const itemContext: IItemContext = useContext(ItemContext); //IItemContext
  const { error, pushItem, sortItems, clearErrors } = itemContext;

  const alertContext: IAlertContext = useContext(AlertContext);
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

    pushItem({ ...item, name: name.trim() }, listId);
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
      <Exporter currentList={currentList} />
      <button
        className="btn btn-link"
        style={{
          float: "right",
          marginRight: "1rem",
          height: "2.4rem",
          color: "#003699"
        }}
        onClick={sortItems}
      >
        <FontAwesomeIcon style={{ height: "100%" }} icon={["fas", "sort-up"]} />
      </button>
      <h2 className="text-primary" style={{ marginLeft: "2.5rem" }}>
        {listName}
      </h2>
      {currentList && inputFields()}
    </div>
  );
};

export default ItemForm;
