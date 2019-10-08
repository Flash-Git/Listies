import React, { useContext, useEffect, useState, Fragment } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import Item from "./Item";
import Spinner from "../layout/Spinner";

import ItemContext from "../../context/item/ItemContext";

import { IItem } from "../../context/item/IItem";

const Items: any = ({ listId }: any) => {
  const itemContext = useContext(ItemContext);

  const { loading, items, getItems, setItems } = itemContext;

  useEffect(() => {
    if (listId === "") return;
    getItems(listId);
    //eslint-disable-next-line
  }, [listId]);

  const initialState: IItem | any = null;
  const [draggedItem, setDraggedItem] = useState(initialState);

  const onDragStart = (e: any, index: number, name: string) => {
    setDraggedItem(items[index]);
    e.dataTransfer.setData("text/plain", name);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (index: number) => {
    const draggedOverItem = items[index];

    // if the item is dragged over itself, ignore
    if (draggedItem === null || draggedItem.id === draggedOverItem.id) return;

    // filter out the currently dragged item
    let newItems = items.filter(
      (item: IItem) => draggedItem && item.id !== draggedItem.id
    );

    // add the dragged item after the dragged over item
    newItems.splice(index, 0, draggedItem);

    setItems(newItems);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <Fragment>
      {items && !loading ? (
        <TransitionGroup>
          {items.map((item: IItem, i: number) => (
            <CSSTransition key={item.id} timeout={200}>
              <div
                className="drag"
                draggable
                onDragStart={e => onDragStart(e, i, item.name)}
                onDragEnd={onDragEnd}
                onDragOver={() => onDragOver(i)}
              >
                <Item item={item} />
              </div>
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
