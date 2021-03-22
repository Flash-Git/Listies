import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { check } from "express-validator";
import config from "config";

import handleErrors from "./handleErrors";

import email from "../../middleware/email";

// Models
import User from "../../models/User";

// @route   POST api/users
// @desc    Register a user
// @access  PUBLIC
router.post(
  "/",
  [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email address").isEmail(),
    check("password", "Please enter a password with 7 or more characters").isLength({
      min: 7,
    }),
  ],
  email, // this needs to run after the rest of this method TODO
  async (req, res) => {
    if (handleErrors(req, res)) return;
    const { name, email, password } = req.body;

    try {
      if (await User.findOne({ email }))
        return res.status(400).send({ msg: "User already exists" });

      const user = new User({
        name,
        email,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const jwtSecret: Secret =
        process.env.NODE_ENV == "production" ? process.env.JWT_SECRET : config.get("jwtSecret");

      // Token
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, jwtSecret, {
        // half day
        expiresIn: 43200,
      });
      res.json({ token });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  }
);

export default router;
