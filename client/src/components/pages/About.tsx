import { FC } from "react";

const About: FC = () => {
  return (
    <div className="container">
      <h1>About</h1>
      <p className="my-1">Full stack React app</p>
      <p className="bg-dark p">
        <strong>Version: </strong> 1.1.0
      </p>
    </div>
  );
};

export default About;
