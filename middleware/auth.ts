import jwt from "jsonwebtoken";
import config from "config";

const auth: any = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token exists
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const jwtSecret: string =
      process.env.NODE_ENV == "production" ? process.env.JWT_SECRET : config.get("jwtSecret");

    const decoded: any = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Invalid token, authorization denied" });
  }
};

export default auth;
