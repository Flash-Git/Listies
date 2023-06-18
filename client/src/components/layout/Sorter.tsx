import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SortItems } from "context";

interface Props {
  sortItems: SortItems;
}

const Sorter: FC<Props> = ({ sortItems }) => (
  <button
    className="btn btn-link"
    style={{
      float: "right",
      marginRight: "0.6rem",
      height: "1.4rem",
    }}
    onClick={sortItems}>
    <FontAwesomeIcon style={{ height: "100%" }} icon={["fas", "sort-up"]} />
  </button>
);

export default Sorter;
