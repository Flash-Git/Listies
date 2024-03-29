import {
  FC,
  useState,
  useContext,
  useEffect,
  Fragment,
  useRef,
  useLayoutEffect,
  ChangeEvent,
  FormEvent,
} from "react";

import Exporter from "../layout/Exporter";
import Sorter from "../layout/Sorter";
import ListMenu from "../layout/ListMenu";

import ItemContext from "../../context/item/ItemContext";

import { List, ItemContext as IItemContext } from "context";

interface Props {
  currentList: List | null;
}

const ItemForm: FC<Props> = ({ currentList }) => {
  const itemContext: IItemContext = useContext(ItemContext);
  const { items, pushItem, sortItems } = itemContext;

  const [listId, setListId] = useState("");
  const [listName, setListName] = useState("No List Selected");

  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((open) => !open);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setListId(currentList ? currentList.id : "");
    setListName(currentList ? currentList.name : "No List Selected");
  }, [currentList]);

  useLayoutEffect(() => {
    inputRef.current?.focus();
  }, [currentList]);

  const emptyItem = {
    name: "",
  };

  const [item, setItem] = useState(emptyItem);
  const { name } = item;

  // Input
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setItem({ ...item, [e.target.name]: e.target.value });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pushItem({ ...item, name: name.trim() }, listId);
    clearAll();
  };

  const clearAll = () => {
    setItem(emptyItem);
  };

  const inputFields = (
    <form
      autoComplete="new-password"
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "0.7rem",
        marginBottom: "0.7rem",
      }}>
      <input
        id="itemFormName"
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
        autoComplete={"off"}
        ref={inputRef}
        autoFocus
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

  return (
    <Fragment>
      <ListMenu open={open} toggleOpen={toggleOpen} />
      <div className="grow-shrink">
        {currentList && (
          <Fragment>
            {open && (
              <Fragment>
                <Exporter currentList={currentList} items={items} />
                <Sorter sortItems={sortItems} />
              </Fragment>
            )}
          </Fragment>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "0 2rem",
          }}>
          <button
            className="btn btn-white text-center"
            onClick={toggleOpen}
            style={{ border: "0" }}>
            <h2 className="text-primary" style={{ margin: currentList ? "0 1.5rem" : "0" }}>
              {listName}
            </h2>
          </button>
        </div>

        {currentList && inputFields}
      </div>
    </Fragment>
  );
};

export default ItemForm;
