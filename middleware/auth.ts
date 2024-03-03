import jwt from "jsonwebtoken";
import config from "config";
import { Middleware } from "express-validator/src/base";

const auth: Middleware = (req, res, next) => {
  const token: string = req.headers["x-auth-token"];

  // Check if token exists
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const jwtSecret: string =
      process.env.NODE_ENV == "production"
        ? process.env.REACT_APP_JWT_SECRET
        : config.get("jwtSecret");

    const decoded = jwt.verify(token, jwtSecret) as { user: string };

    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Invalid token, authorization denied" });
  }
};

export default auth;
