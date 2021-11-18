import { FC, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AppContext from "../../context/app/AppContext";

import { AppContext as IAppContext } from "context";

const DarkToggle: FC = () => {
  const appContext: IAppContext = useContext(AppContext);

  const { toggleDarkMode } = appContext;

  return (
    <div
      style={{
        position: "absolute",
        right: "0.5rem",
        paddingLeft: "0.8rem",
        paddingRight: "0.5rem",
        zIndex: "1",
      }}
    >
      <button className={"btn btn-link"} onClick={toggleDarkMode}>
        <FontAwesomeIcon icon={["fas", "moon"]} />
      </button>
    </div>
  );
};

export default DarkToggle;
