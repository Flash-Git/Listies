import { FC, useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Item from "./Item";
import Spinner from "../layout/Spinner";

import AppContext from "../../context/app/AppContext";
import AlertContext from "../../context/alert/AlertContext";
import AuthContext from "../../context/auth/AuthContext";
import ItemContext from "../../context/item/ItemContext";

import {
  AppContext as IAppContext,
  AlertContext as IAlertContext,
  AuthContext as IAuthContext,
  ItemContext as IItemContext,
  Item as IItem,
  List,
} from "context";

interface Props {
  currentList: List | null;
}

const Items: FC<Props> = ({ currentList }) => {
  const appContext: IAppContext = useContext(AppContext);
  const { socket } = appContext;

  const authContext: IAuthContext = useContext(AuthContext);
  const { loading: authLoading, isAuthenticated } = authContext;

  const itemContext: IItemContext = useContext(ItemContext);
  const {
    loading,
    items,
    error,
    addItem,
    editItem,
    setItems,
    deleteItem,
    getItems,
    clearItems,
    clearErrors,
  } = itemContext;

  const alertContext: IAlertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  useEffect(() => {
    if (!socket) return;

    socket.on("addItem", (item: IItem, listId: string) => {
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
    if (!error) return;
    addAlert(error, "danger");
    clearErrors();
  }, [error]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    currentList ? getItems(currentList.id) : clearItems();
  }, [currentList, authLoading, isAuthenticated]);

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
    if (!currentList) return;

    const draggedOverItem = items[index];

    // if the item is dragged over itself, ignore
    if (draggedItem === null || draggedItem.id === draggedOverItem.id) return;

    // filter out the currently dragged item
    let newItems = items.filter((item: IItem) => draggedItem && item.id !== draggedItem.id);

    // add the dragged item after the dragged over item
    newItems.splice(index, 0, draggedItem);

    setItems(newItems, currentList.id);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  if (!loading) {
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
