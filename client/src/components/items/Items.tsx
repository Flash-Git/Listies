import React, { useContext, useEffect, useState, Fragment, FC } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Item from "./Item";
import Spinner from "../layout/Spinner";

import ItemContext from "../../context/item/ItemContext";

import { Item as IItem, ItemContext as IItemContext, List } from "context";

import socketIOClient from "socket.io-client";

interface Props {
  currentList: List;
}

const Items: FC<Props> = ({ currentList }) => {
  const itemContext: IItemContext = useContext(ItemContext);
  const { loading, items, getItems, setItems, clearItems } = itemContext;
  console.log(currentList);

  useEffect(() => {
    // const socket = socketIOClient("http://localhost:5000");
    const socket = socketIOClient();
    socket.on("FromAPI", () => {
      console.log(currentList);

      currentList && getItems(currentList.id);
    });
    //   //eslint-disable-next-line
  }, [currentList]);

  useEffect(() => {
    currentList ? getItems(currentList.id) : clearItems();

    //eslint-disable-next-line
  }, [currentList]);

  /*
   * Dragging
   */

  const [draggedItem, setDraggedItem] = useState<IItem | null>(null);

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

    setItems(newItems, currentList.id);
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

export default Items;
