const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const config = require("config");

const auth = require("../../middleware/auth");
import User from "../../models/User";
const handleErrors = require("./handleErrors");

// @route   GET api/auth
// @desc    Get logged in user
// @access  PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
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
    check("password", "Please enter your password").exists()
  ],
  async (req, res) => {
    if (handleErrors(req, res)) return;

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
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
          // 14 days
          expiresIn: 1209600
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

module.exports = router;
