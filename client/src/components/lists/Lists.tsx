import { DragEvent, FC, useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import ListItem from "./ListItem";
import Spinner from "../layout/Spinner";

import AppContext from "../../context/app/AppContext";
import AlertContext from "../../context/alert/AlertContext";
import AuthContext from "../../context/auth/AuthContext";
import ListContext from "../../context/list/ListContext";

import {
  AppContext as IAppContext,
  AlertContext as IAlertContext,
  AuthContext as IAuthContext,
  List,
  ListContext as IListContext,
} from "context";

const Lists: FC = () => {
  const appContext: IAppContext = useContext(AppContext);
  const { socket } = appContext;

  const alertContext: IAlertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  const authContext: IAuthContext = useContext(AuthContext);
  const { loading: authLoading, isAuthenticated } = authContext;

  const listContext: IListContext = useContext(ListContext);
  const { error, loading, lists, getLists, setLists, clearErrors, addList, deleteList } =
    listContext;

  useEffect(() => {
    if (!socket) return;

    socket.on("addList", (list: List) => {
      addList(list);
    });
    socket.on("deleteList", (listId: string) => {
      deleteList(listId);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  useEffect(() => {
    if (!error) return;
    addAlert(error, "danger");
    clearErrors();
  }, [error]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    getLists();
  }, [authLoading, isAuthenticated]);

  /*
  / Dragging
  */

  const [draggedList, setDraggedList] = useState<List | null>(null);

  const onDragStart = (e: DragEvent<HTMLDivElement>, index: number, name: string) => {
    setDraggedList(lists[index]);
    e.dataTransfer.setData("text/plain", name);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (index: number) => {
    // if the item is dragged over itself, ignore
    if (draggedList === null || draggedList.id === lists[index].id) return;
    // filter out the currently dragged item
    const newLists = lists.filter((list: List) => draggedList && list.id !== draggedList.id);
    // add the dragged item after the dragged over item
    newLists.splice(index, 0, draggedList);
    setLists(newLists);
  };

  const onDragEnd = () => {
    setDraggedList(null);
  };

  if (loading) return <Spinner />;

  return (
    <TransitionGroup>
      {lists.map((list: List, i: number) => (
        <CSSTransition key={list.id} timeout={200}>
          <div
            className="drag"
            draggable
            onDragStart={(e) => onDragStart(e, i, list.name)}
            onDragEnd={onDragEnd}
            onDragOver={() => onDragOver(i)}
          >
            <ListItem list={list} />
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default Lists;
