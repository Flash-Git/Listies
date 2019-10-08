import React, { useContext, useEffect, useState, Fragment } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import ListContext from "../../context/list/ListContext";
import ListItem from "./ListItem";
import Spinner from "../layout/Spinner";

import { IList } from "../../context/list/IList";

const Lists = () => {
  const listContext = useContext(ListContext);

  const { loading, lists, getLists, setLists } = listContext;

  useEffect(() => {
    getLists();
    //eslint-disable-next-line
  }, []);

  const initialState: IList | any = null;
  const [draggedList, setDraggedList] = useState(initialState);

  const onDragStart = (e: any, index: number, name: string) => {
    setDraggedList(lists[index]);
    e.dataTransfer.setData("text/plain", name);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (index: number) => {
    const draggedOverItem = lists[index];

    // if the item is dragged over itself, ignore
    if (draggedList === null || draggedList.id === draggedOverItem.id) return;

    // filter out the currently dragged item
    let newLists = lists.filter(
      (list: IList) => draggedList && list.id !== draggedList.id
    );

    // add the dragged item after the dragged over item
    newLists.splice(index, 0, draggedList);

    setLists(newLists);
  };

  const onDragEnd = () => {
    setDraggedList(null);
  };

  return (
    <Fragment>
      {lists && !loading ? (
        <TransitionGroup>
          {lists.map((list: IList, i: number) => (
            <CSSTransition
              key={list.id}
              timeout={200}
              onDragOver={() => onDragOver(i)}
            >
              <div>
                <div
                  className="drag"
                  draggable
                  onDragStart={e => onDragStart(e, i, list.name)}
                  onDragEnd={onDragEnd}
                >
                  <ListItem list={list} />
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

export default Lists;
