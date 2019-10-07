import React, { useContext, useEffect, Fragment } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import Item from "./Item";
import Spinner from "../layout/Spinner";

import ItemContext from "../../context/item/ItemContext";

import { IItem } from "../../context/item/IItem";

const Items: any = ({ listId }: any) => {
  const itemContext = useContext(ItemContext);

  const { loading, items, getItems } = itemContext;

  useEffect(() => {
    if (listId === "") return;
    getItems(listId);
    //eslint-disable-next-line
  }, [listId]);

  return (
    <Fragment>
      {items && !loading ? (
        <TransitionGroup>
          {items.map((item: IItem) => (
            <CSSTransition key={item.id} timeout={200}>
              <Item item={item} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

Item.propTypes = {
  listId: PropTypes.object
};

export default Items;
