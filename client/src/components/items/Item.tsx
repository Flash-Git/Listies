import { FC, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ItemContext from "../../context/item/ItemContext";

import { Item as IItem, ItemContext as IItemContext } from "context";

interface Props {
  item: IItem;
  confirmDialog(): void;
}

const Item: FC<Props> = ({ item, confirmDialog }) => {
  const { name, checked, importance, marked } = item;

  const itemContext: IItemContext = useContext(ItemContext);
  const { pushEditItem } = itemContext;

  const toggleCheck = () => {
    pushEditItem({ ...item, checked: !checked, marked: false });
  };

  const incrementImportance = () => {
    pushEditItem({ ...item, importance: (importance + 1) % 3 });
  };

  const onMarkDelete = () => {
    // TODO option to skip mark delete in preferences - instant - double click - individual confirm - mass confirm
    // pushDeleteItem(id);
    if (!marked) pushEditItem({ ...item, checked: true, marked: true });
    else confirmDialog();
  };

  const importanceButton = () => {
    let backgroundColor = "";
    switch (importance) {
      case 0:
        backgroundColor = "yellow";
        break;
      case 1:
        backgroundColor = "orange";
        break;
      case 2:
        backgroundColor = "red";
        break;
      default:
        backgroundColor = "white";
    }
    return (
      <button
        onClick={incrementImportance}
        className="btn-importance"
        style={{
          backgroundColor,
        }}></button>
    );
  };

  return (
    <div
      className="card grow-shrink"
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: "0.25rem",
        boxShadow: "0 0 3.5px -2px rgba(0,0,0,0.35)",
      }}>
      {importanceButton()}
      <input
        style={{
          transform: "scale(1.25)",
        }}
        className="mx-1"
        type="checkbox"
        onChange={toggleCheck}
        checked={checked}
      />
      <button
        className="btn btn-discreet text-left"
        onClick={incrementImportance}
        style={{
          margin: 0,
          padding: 0,
          flexGrow: 1,
          flexShrink: 1,
          maxWidth: "14.8rem",
        }}>
        <span
          className={`text-primary ${marked && "strike-diag"}`}
          style={{
            wordWrap: "break-word",
          }}>
          {name}
        </span>
      </button>
      <div>
        <button
          className="btn"
          onClick={onMarkDelete}
          style={{
            fontSize: "1rem",
            padding: "0.2rem 0.2rem",
            marginLeft: "0.5rem",
            // padding: "0.1rem 0.6rem",
            // marginRight: "0",
            color: "red",
            alignSelf: "flex-end",
            justifySelf: "center",
          }}>
          {/* Delete */}
          <FontAwesomeIcon icon={["fas", "times"]} />
        </button>
      </div>
    </div>
  );
};

export default Item;
