import { FC, useState } from "react";

interface Props {
  action(): void;
  undoAction?(): void;
  title: string;
  content: string;
  closeModal(): void;
}

const Modal: FC<Props> = (props) => {
  const [hovering, setHovering] = useState(true);

  return (
    <div
      className="dialog-container dialog-overlay"
      onClick={() => {
        !hovering && props.closeModal();
      }}>
      <div
        className="card bg-light my dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0.7rem",
          boxShadow: "0 0 2px 0px rgba(0,0,0,0.35)",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        title={props.title}>
        <p className="dialog-content text-primary text-left grow-shrink p">{props.content}</p>
        <div
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          <button
            className="btn-discreet"
            style={{
              margin: "0.5rem",
              fontSize: "90%",
              wordWrap: "break-word",
              fontWeight: "bold",
            }}
            onClick={() => {
              props.action();
              props.closeModal();
            }}>
            Confirm
          </button>
          <button
            className="btn-discreet"
            style={{
              margin: "0.5rem",
              fontSize: "90%",
              wordWrap: "break-word",
              fontWeight: "bold",
            }}
            onClick={() => {
              props.undoAction && props.undoAction();
              props.closeModal();
            }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
