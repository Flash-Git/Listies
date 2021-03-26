import { useState, useContext, FC, ChangeEvent, FormEvent } from "react";

import ListContext from "../../context/list/ListContext";

import { List, ListContext as IListContext } from "context";

const ListForm: FC = () => {
  const listContext: IListContext = useContext(ListContext);
  const { pushList, clearCurrentList } = listContext;

  const emptyList: List = {
    name: "",
    password: "",
    id: "",
  };

  const [list, setList] = useState(emptyList);
  const { name, password } = list;

  // Input
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setList({ ...list, [e.target.name]: e.target.value });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    pushList({ ...list, name: name.trim() });
    clearAll();
  };

  const clearAll = () => {
    setList(emptyList);
    clearCurrentList();
  };

  return (
    <div className="grow-shrink">
      <h2 className="text-primary">Add New List</h2>
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
          id="listFormName"
          style={{
            minWidth: "5rem",
            maxWidth: "15rem",
            margin: "0",
            marginBottom: "0.7rem",
          }}
          type="text"
          placeholder="List Name"
          name="name"
          value={name}
          autoComplete="off"
          onChange={onChange}
        />
        <input
          style={{
            minWidth: "5rem",
            maxWidth: "15rem",
            margin: "0",
            marginBottom: "0.7rem",
          }}
          type="password"
          placeholder="List Password"
          name="password"
          value={password}
          autoComplete="new-password"
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
    </div>
  );
};

export default ListForm;
