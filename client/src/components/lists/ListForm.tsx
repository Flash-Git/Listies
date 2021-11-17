import { useState, useContext, FC, ChangeEvent, FormEvent, useEffect } from "react";

import ListContext from "../../context/list/ListContext";

import { ListContext as IListContext } from "context";
import { useNavigate } from "react-router";

interface Props {
  initialAccessId?: string;
}

const ListForm: FC<Props> = ({ initialAccessId }) => {
  const navigate = useNavigate();

  const listContext: IListContext = useContext(ListContext);
  const { connectList, pushList, clearCurrentList } = listContext;

  const [connectForm, setConnectForm] = useState(false);

  const emptyList = {
    id: "",
    owner: "",
    name: "",
    private: false,
    accessId: "",
    password: "",
    users: [],
    date: 0,
  };

  const [list, setList] = useState(emptyList);
  const { name, accessId, password } = list;

  useEffect(() => {
    if (!initialAccessId) return;
    navigate("/");
    setConnectForm(true);
    setList({ ...list, accessId: initialAccessId });
  }, [initialAccessId]);

  // Flip between add and connect
  const flipConnectForm = () => {
    setConnectForm((connectForm) => !connectForm);
  };

  // Input
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setList({ ...list, [e.target.name]: e.target.value });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (connectForm) connectList(accessId, password);
    else pushList({ ...list, name: name.trim() });
    clearAll();
  };

  const clearAll = () => {
    setList(emptyList);
    clearCurrentList();
  };

  return (
    <div className="grow-shrink">
      <button className="btn-block btn-white" onClick={flipConnectForm} style={{ border: "0" }}>
        <h2 className="text-primary">{connectForm ? "Connect To List" : "Add New List"}</h2>
      </button>
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
          name={connectForm ? "accessId" : "name"}
          value={connectForm ? accessId : name}
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
          value={connectForm ? "Connect To List" : "Add New List"}
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default ListForm;
