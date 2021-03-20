import { FC } from "react";

import spinnerAnim from "./spinner.gif";

const Spinner: FC = () => (
  <img
    src={spinnerAnim}
    alt="Loading..."
    style={{ width: "200px", margin: "auto", display: "block" }}
  />
);

export default Spinner;
