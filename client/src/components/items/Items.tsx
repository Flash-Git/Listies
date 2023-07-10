import { DragEvent, FC, useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Item from "./Item";
import Spinner from "../layout/Spinner";
import Modal from "../layout/Modal";

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
  const { socket, identifed, updateSocketList } = appContext;

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
    pushEditItem,
    pushDeleteItem,
    getItems,
    clearItems,
    clearErrors,
  } = itemContext;

  const alertContext: IAlertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (!socket || !currentList || !identifed) return;

    updateSocketList(currentList.id);
  }, [identifed, currentList, socket]);

  useEffect(() => {
    if (!socket || !currentList || authLoading || !isAuthenticated) return;

    socket.on("addItem", (item: IItem, listId: string) => {
      if (currentList.id !== listId) return;
      addItem(item, listId);
    });
    socket.on("editItem", (item: IItem) => {
      editItem(item);
    });
    socket.on("deleteItem", (itemId: string) => {
      deleteItem(itemId);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, currentList]);

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

  const onDragStart = (e: DragEvent<HTMLDivElement>, index: number, name: string) => {
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

  /*
   * Modal
   *
   */

  const confirmDialog = () => {
    setConfirmModal(true);
  };

  const confirmDelete = () => {
    items.filter((item) => item.marked).map((item) => pushDeleteItem(item.id));
  };

  const unMarkDelete = () => {
    items.filter((item) => item.marked).map((item) => pushEditItem({ ...item, marked: false }));
  };

  const closeModal = () => {
    setConfirmModal(false);
  };

  if (loading) return <Spinner />;

  return (
    <>
      <TransitionGroup>
        {items.map((item: IItem, i: number) => (
          <CSSTransition key={item.id} timeout={200}>
            <div
              className="drag"
              draggable
              onDragStart={(e) => onDragStart(e, i, item.name)}
              onDragEnd={onDragEnd}
              onDragOver={() => onDragOver(i)}>
              <Item item={item} confirmDialog={confirmDialog} />
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
      {confirmModal && (
        <div>
          <Modal
            action={confirmDelete}
            undoAction={unMarkDelete}
            content="Do you want to delete these items?"
            title="Confirm"
            closeModal={closeModal}
          />
        </div>
      )}
    </>
  );
};

export default Items;
