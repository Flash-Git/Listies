import { FC } from "react";

import spinnerAnim from "./spinner.svg";
// import spinnerAnim from "./spinner.gif";

const Spinner: FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
    }}
  >
    <img
      src={spinnerAnim}
      alt="Loading..."
      style={{
        width: "130px",
        display: "block",
        margin: "0 auto",
      }}
    />
  </div>
);

export default Spinner;
