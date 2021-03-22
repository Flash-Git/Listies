import express from "express";
import jwt, { Secret } from "jsonwebtoken";
import { check } from "express-validator";
import config from "config";

const router = express.Router();

import handleErrors from "./handleErrors";

import email from "middleware/email";

// Models
import User from "../../models/User";

// @route   GET api/verification
// @desc    Get verification
// @access  PUBLIC
router.get("/:email/:token", async (req: any, res) => {
  try {
    const tokenParam = req.params.token;
    const emailParam = req.params.email;

    const user = await User.findOne({ email: emailParam });
    if (!user) return res.status(401).send({ msg: "Email not found" });

    const jwtSecret: Secret =
      process.env.NODE_ENV == "production" ? process.env.JWT_SECRET : config.get("jwtSecret");

    jwt.verify(tokenParam, jwtSecret, (e, decoded) => {
      if (e) res.status(403).send({ msg: "Invalid token" });
    });

    user.verified = true;
    await user.save();

    res.redirect("/api/login");
    // res.json(user);
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
  email,
  // [
  //   check("email", "Please enter your email address").isEmail(),
  //   check("password", "Please enter your password").exists(),
  // ],

  async (req: any, res) => {
    if (handleErrors(req, res)) return;
    const { name, email, password } = req.body;

    try {
      // res.status(200).send();
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  }
);

export default router;
