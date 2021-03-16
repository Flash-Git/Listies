import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check } from "express-validator";
import config from "config";

import handleErrors from "./handleErrors";

import auth from "../../middleware/auth";

// Models
import { IUser } from "models";
import User from "../../models/User";

// @route   GET api/auth
// @desc    Get logged in user
// @access  PRIVATE
router.get("/", auth, async (req: any, res) => {
  try {
    const user: IUser = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  PUBLIC
router.post(
  "/",
  [
    check("email", "Please enter your email address").isEmail(),
    check("password", "Please enter your password").exists(),
  ],
  async (req, res) => {
    if (handleErrors(req, res)) return;

    const { email, password } = req.body;

    try {
      let user: IUser = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ msg: "Invalid Credentials" });
      }

      //Token
      const payload = {
        user: {
          id: user.id,
        },
      };

      let jwtSecret;
      if (process.env.NODE_ENV == "production") {
        jwtSecret = process.env.JWT_SECRET;
      } else {
        jwtSecret = config.get("jwtSecret");
      }
      jwt.sign(
        payload,
        jwtSecret,
        {
          // 14 days
          expiresIn: 1209600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  }
);

export default router;
