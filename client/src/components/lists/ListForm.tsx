import { FC, useState, useContext, useEffect, ChangeEvent, FormEvent } from "react";

import ListContext from "../../context/list/ListContext";

import { ListContext as IListContext } from "context";

interface Props {
  initialAccessId?: string;
}

const ListForm: FC<Props> = ({ initialAccessId }) => {
  const listContext: IListContext = useContext(ListContext);
  const { connectList, pushList } = listContext;

  /*
   * State
   *
   * */

  const emptyList = {
    id: "",
    owner: "",
    listName: "",
    private: false,
    accessId: "",
    listPassword: "",
    users: [],
    date: 0,
  };

  const [list, setList] = useState(emptyList);
  const { listName, accessId, listPassword } = list;

  const [connectForm, setConnectForm] = useState(false);

  useEffect(() => {
    if (!initialAccessId) return;

    setConnectForm(true);
    setList({ ...list, accessId: initialAccessId });
  }, [initialAccessId]);

  /*
   * Input
   *
   * */

  // Flip between add and connect
  const flipConnectForm = () => {
    setConnectForm((connectForm) => !connectForm);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setList({ ...list, [e.target.name]: e.target.value });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (connectForm) connectList(accessId, listPassword);
    else pushList({ ...list, password: listPassword, name: listName.trim() });
    setList(emptyList);
  };

  return (
    <div className="grow-shrink">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "0 2rem",
        }}
      >
        <button
          className="btn btn-white text-center"
          onClick={flipConnectForm}
          style={{ border: "0" }}
        >
          <h2 className="text-primary">{connectForm ? "Connect To List" : "Add New List"}</h2>
        </button>
      </div>
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
          placeholder={connectForm ? "List Access Code" : "List Name"}
          name={connectForm ? "accessId" : "listName"}
          value={connectForm ? accessId : listName}
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
          name="listPassword"
          value={listPassword}
          autoComplete="off"
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
          value={connectForm ? "Connect To List" : "Add New List"}
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default ListForm;
