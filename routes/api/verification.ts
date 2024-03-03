import { Response, Router } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { check } from "express-validator";
import { Request } from "express-validator/src/base";
import config from "config";

import handleErrors from "./handleErrors";

import sendEmail from "./email";

// Models
import User from "../../models/User";

const router = Router();

// @route   GET api/verification
// @desc    Get verification
// @access  PUBLIC
router.get("/:email/:token", async (req: Request, res: Response) => {
  const { token, email }: { token?: string; email?: string } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ msg: "User not found" });

    const jwtSecret: Secret =
      process.env.NODE_ENV == "production" ? process.env.REACT_APP_JWT_SECRET : config.get("jwtSecret");

    jwt.verify(token, jwtSecret, (e, _decoded) => {
      if (e) res.status(403).send({ msg: "Invalid token" });
    });

    user.verified = true;
    await user.save();

    res.redirect("/login");
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

// @route   POST api/verification
// @desc    Send verification email
// @access  PUBLIC
router.post(
  "/",
  [check("email", "Please enter your email address").isEmail()],
  async (req: Request, res: Response) => {
    if (handleErrors(req, res)) return;
    const { email }: { email: string } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send({ msg: "User not found" });

      if (user.verified) return res.status(400).send({ msg: "User has already been verified" });

      await sendEmail(req, res, user);
      res.json({ msg: "Verification email sent" });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  }
);

export default router;
