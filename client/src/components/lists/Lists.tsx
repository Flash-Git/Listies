import { FC, useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import ListItem from "./ListItem";
import Spinner from "../layout/Spinner";

import AlertContext from "../../context/alert/AlertContext";
import AuthContext from "../../context/auth/AuthContext";
import ListContext from "../../context/list/ListContext";

import {
  List,
  ListContext as IListContext,
  AuthContext as IAuthContext,
  AlertContext as IAlertContext,
} from "context";

const Lists: FC = () => {
  const alertContext: IAlertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  const authContext: IAuthContext = useContext(AuthContext);
  const { loading: authLoading, isAuthenticated } = authContext;

  const listContext: IListContext = useContext(ListContext);
  const { error, loading, lists, getLists, setLists, clearErrors } = listContext;

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

  const onDragStart = (e: any, index: number, name: string) => {
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

  if (!loading) {
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
  }
  return <Spinner />;
};

export default Lists;
