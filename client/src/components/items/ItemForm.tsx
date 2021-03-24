import { FC, useState, useContext, useEffect, Fragment } from "react";

import Exporter from "../layout/Exporter";
import Sorter from "../layout/Sorter";

import ItemContext from "../../context/item/ItemContext";

import { List, ItemContext as IItemContext } from "context";

interface Props {
  currentList: List | null;
}

const ItemForm: FC<Props> = ({ currentList }) => {
  const itemContext: IItemContext = useContext(ItemContext);
  const { items, pushItem, sortItems } = itemContext;

  // List
  const [listId, setListId] = useState("");
  const [listName, setListName] = useState("No List Selected");

  useEffect(() => {
    setListId(currentList ? currentList.id : "");
    setListName(currentList ? currentList.name : "No List Selected");
  }, [currentList]);

  const emptyItem = {
    name: "",
  };

  const [item, setItem] = useState(emptyItem);
  const { name } = item;

  // Input
  const onChange = (e: any) => setItem({ ...item, [e.target.name]: e.target.value });

  const onSubmit = (e: any) => {
    e.preventDefault();

    pushItem({ ...item, name: name.trim() }, listId);
    clearAll();
  };

  const clearAll = () => {
    setItem(emptyItem);
  };

  const inputFields = (
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
          maxWidth: "6rem",
          margin: "0",
          marginBottom: "0.7rem",
          padding: "0.1rem",
        }}
        type="submit"
        value={"Add Item"}
        className="btn btn-primary btn-block"
      />
    </form>
  );

  // Render
  return (
    <div
      className="grow-shrink"
      style={
        {
          // minHeight: "1.5rem"
        }
      }
    >
      {currentList && (
        <Fragment>
          <Exporter currentList={currentList} items={items} />
          <Sorter sortItems={sortItems} />
        </Fragment>
      )}
      <h2 className="text-primary" style={{ marginLeft: currentList ? "2.5rem" : "0" }}>
        {listName}
      </h2>
      {currentList && inputFields}
    </div>
  );
};

export default ItemForm;
