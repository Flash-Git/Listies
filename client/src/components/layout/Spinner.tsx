import React, { FC, Fragment } from "react";
import spinner from "./spinner.gif";

const Spinner: FC = () => (
  <Fragment>
    <img
      src={spinner}
      alt="Loading..."
      style={{ width: "200px", margin: "auto", display: "block" }}
    />
  </Fragment>
);

export default Spinner;
