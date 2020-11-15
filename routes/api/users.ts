import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check } from "express-validator";
import config from "config";

import handleErrors from "./handleErrors";

// Models
import { IUser } from "models";
import User from "../../models/User";

// @route   POST api/users
// @desc    Register a user
// @access  PUBLIC
router.post(
  "/",
  [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email address").isEmail(),
    check(
      "password",
      "Please enter a password with 7 or more characters"
    ).isLength({
      min: 7
    })
  ],
  async (req, res) => {
    if (handleErrors(req, res)) return;

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).send({ msg: "User already exists" });
      }
      user = new User({
        name,
        email
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //Token
      const payload = {
        user: {
          id: user.id
        }
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
          expiresIn: 7200
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
