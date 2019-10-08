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

  const onDragStart = (e: any, index: number) => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragOver = (index: number) => {
    const draggedOverItem = items[index];

    // if the item is dragged over itself, ignore
    if (draggedItem === null || draggedItem.id === draggedOverItem.id) return;

    // filter out the currently dragged item
    let otherItems = items.filter(
      (item: IItem) => draggedItem && item.id !== draggedItem.id
    );

    // add the dragged item after the dragged over item
    otherItems.splice(index, 0, draggedItem);

    setItems(otherItems);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <Fragment>
      {items && !loading ? (
        <TransitionGroup>
          {items.map((item: IItem, i: number) => (
            <CSSTransition
              key={item.id}
              timeout={200}
              onDragOver={() => onDragOver(i)}
            >
              <div>
                <div
                  className="drag"
                  draggable
                  onDragStart={e => onDragStart(e, i)}
                  onDragEnd={onDragEnd}
                >
                  <Item item={item} />
                </div>
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
