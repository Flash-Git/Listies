import { FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = () => {
  return (
    <div className="container">
      <h1>Not Found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <p className="lead">
        Click
        <strong>
          <Link to={"/"}>&nbsp;here&nbsp;</Link>
        </strong>
        to return home.
      </p>
    </div>
  );
};

export default NotFound;
