import { FormEvent, Fragment, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListContext from "../../context/list/ListContext";

import { ListContext as IListContext } from "context";

const ListMenu = () => {
  const listContext: IListContext = useContext(ListContext);
  const { currentList } = listContext;

  const [state, setstate] = useState({ open: false });

  const toggleOpen = () => {
    setstate((state) => ({ ...state, open: !state.open }));
  };

  const copy = () => {
    if (!currentList || currentList.private) return;
    navigator.clipboard.writeText(`${window.location.href}connect/${currentList.accessId}`);
    toggleOpen();
  };

  const toggler = (
    <button
      className="btn btn-link"
      style={{
        float: "right",
        marginRight: "1rem",
        height: "2.4rem",
      }}
      onClick={toggleOpen}
    >
      <FontAwesomeIcon
        style={{ height: "2rem", width: "2rem" }}
        icon={["fas", state.open ? "caret-left" : "sort-up"]}
      />
    </button>
  );
  return (
    <Fragment>
      {toggler}
      {state.open && (
        // <div style={{ height: "3rem" }}>
        // {/* <form> */}
        // {/* <div className="form-group"> */}
        <button className="btn btn-white btn-block " onClick={copy}>
          Share Link
        </button>
        // </div>
        // {/* </form> */}
        // </div>
      )}
    </Fragment>
  );
};

export default ListMenu;
