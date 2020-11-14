import jwt from "jsonwebtoken";
import config from "config";

module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if token exists
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    let jwtSecret;
    if (process.env.NODE_ENV == "production") {
      jwtSecret = process.env.JWT_SECRET;
    } else {
      jwtSecret = config.get("jwtSecret");
    }

    const decoded: any = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: "Invalid token, authorization denied" });
  }
};
