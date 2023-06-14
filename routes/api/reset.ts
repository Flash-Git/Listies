import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { check } from "express-validator";
import { Request } from "express-validator/src/base";
import config from "config";

import handleErrors from "./handleErrors";

import sendEmail from "./email";

// Models
import User from "../../models/User";

import { User as IUser } from "models";

const router = Router();

// @route   POST api/reset
// @desc    Edit a user's password
// @access  PUBLIC
router.post(
  "/",
  [
    check("email", "Please enter a valid email address").isEmail(),
    check("password", "Please enter a password with 7 or more characters").isLength({
      min: 7,
    }),
  ],
  async (req: Request, res: Response) => {
    if (handleErrors(req, res)) return;
    const { email, password }: IUser = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).send({ msg: "User not found" });
 
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const jwtSecret: Secret =
        process.env.NODE_ENV == "production" ? process.env.REACT_APP_JWT_SECRET : config.get("jwtSecret");

      // Token
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, jwtSecret, {
        // expiresIn: 43200, // half day
        expiresIn: 604800, // 1 week
      });


      // TODO new email type
      // await sendEmail(req, res, user);

      // res.json({ msg: "Verification email sent", token });
      res.json({ msg: "Password reset", token });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  }
);

export default router;
