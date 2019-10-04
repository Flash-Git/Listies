import React, { Fragment, useContext, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import ListContext from "../../context/list/ListContext";
import ListItem from "./ListItem";
import Spinner from "../layout/Spinner";

import { IList } from "../../context/list/IList";

const Lists = () => {
  const listContext = useContext(ListContext);

  const { loading, lists, getLists } = listContext;

  useEffect(() => {
    getLists();
    //eslint-disable-next-line
  }, []);

  if (lists && lists.length === 0 && !loading) {
    return (
      <div className="container">
        <h4>Please add a list</h4>
      </div>
    );
  }

  return (
    <div className="container">
      {lists && !loading ? (
        <TransitionGroup>
          {lists.map((list: IList) => (
            <CSSTransition key={list.id} timeout={200} classNames="item">
              <ListItem list={list} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Lists;
