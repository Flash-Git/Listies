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

  return (
    <div className="text-center">
      {open && (
        <button
          className="btn btn-discreet text-center"
          style={{
            marginBottom: "0.4rem",
            marginLeft: "1.4rem",
            borderStyle: "solid",
            borderRadius: "0.5em",
          }}
          onClick={copy}>
          Copy Link
        </button>
      )}
      <button
        className="btn btn-link"
        style={{
          float: "right",
          height: "1.4rem",
        }}
        onClick={toggleOpen}>
        <FontAwesomeIcon
          style={{ height: "1.2rem", width: "1.2rem" }}
          icon={["fas", open ? "caret-left" : "sort-up"]}
        />
      </button>
    </div>
  );
};

export default ListMenu;
