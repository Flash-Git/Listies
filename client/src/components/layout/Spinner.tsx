import React, { Fragment } from "react";
import spinner from "./spinner.gif";

const Spinner: React.FC = () => (
  <Fragment>
    <img
      src={spinner}
      alt="Loading..."
      style={{ width: "200px", margin: "auto", display: "block" }}
    />
  </Fragment>
);

export default Spinner;
