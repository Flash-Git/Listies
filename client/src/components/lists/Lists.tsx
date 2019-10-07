import React, { useContext, useEffect, Fragment } from "react";
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
    return <h4>Please add a list</h4>;
  }

  return (
    <Fragment>
      {lists && !loading ? (
        <TransitionGroup>
          {lists.map((list: IList) => (
            <CSSTransition key={list.id} timeout={200}>
              <ListItem list={list} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

export default Lists;
