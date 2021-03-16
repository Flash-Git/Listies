import React, { useContext, useEffect, useState, FC } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Item from "./Item";
import Spinner from "../layout/Spinner";

import AppContext from "../../context/app/AppContext";
import ItemContext from "../../context/item/ItemContext";

import {
  AppContext as IAppContext,
  Item as IItem,
  List,
  ItemContext as IItemContext,
} from "context";

interface Props {
  currentList: List;
}

const Items: FC<Props> = ({ currentList }) => {
  const appContext: IAppContext = useContext(AppContext);
  const { socket } = appContext;

  const itemContext: IItemContext = useContext(ItemContext);
  const {
    loading,
    items,
    addItem,
    editItem,
    getItems,
    setItems,
    deleteItem,
    clearItems,
  } = itemContext;

  useEffect(() => {
    if (socket === null) return;

    socket.on("addItem", (item: IItem, listId: string) => {
      // Cannot access currentList prop
      const lsList = JSON.parse(localStorage["currentList"]);
      if (!lsList || lsList.id !== listId) return;
      addItem(item, listId);
    });
    socket.on("editItem", (item: IItem) => {
      editItem(item);
    });
    socket.on("deleteItem", (itemId: string) => {
      deleteItem(itemId);
    });
  }, [socket]);

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

  if (items && !loading) {
    return (
      <TransitionGroup>
        {items.map((item: IItem, i: number) => (
          <CSSTransition key={item.id} timeout={200}>
            <div
              className="drag"
              draggable
              onDragStart={(e) => onDragStart(e, i, item.name)}
              onDragEnd={onDragEnd}
              onDragOver={() => onDragOver(i)}
            >
              <Item item={item} />
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  }

  return <Spinner />;
};

export default Items;
