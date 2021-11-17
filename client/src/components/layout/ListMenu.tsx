import { FC, FormEvent, Fragment, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListContext from "../../context/list/ListContext";

import { ListContext as IListContext } from "context";

interface Props {
  open: boolean;
  toggleOpen: () => void;
}

const ListMenu: FC<Props> = ({ open, toggleOpen }) => {
  const listContext: IListContext = useContext(ListContext);
  const { currentList } = listContext;

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
        icon={["fas", open ? "caret-left" : "sort-up"]}
      />
    </button>
  );
  return (
    <Fragment>
      {toggler}
      {open && (
        <button className="btn btn-white btn-block " onClick={copy}>
          Share Link
        </button>
      )}
    </Fragment>
  );
};

export default ListMenu;
