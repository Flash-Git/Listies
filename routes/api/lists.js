express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const handleErrors = require("./handleErrors");

const auth = require("../../middleware/auth");

// Models
const List = require("../../models/List");

// @route   GET api/lists
// @desc    Get all user's lists
// @access  PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    //Get lists by most recent
    const lists = await List.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(lists);
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

// @route   POST api/lists
// @desc    Create a list
// @access  PRIVATE
router.post(
  "/",
  [
    auth,
    [
      check("name", "Please enter a name")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    if (handleErrors(req, res)) return;

    const { name } = req.body;
    try {
      const newList = new List({
        name,
        user: req.user.id
      });

      const list = await newList.save();
      res.json(list);
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  }
);

// @route   DELETE api/lists
// @desc    Delete a user's list
// @access  PRIVATE
router.delete("/:id", auth, async (req, res) => {
  try {
    let list = await List.findById(req.params.id);
    if (!list) return res.status(404).send({ msg: "List not found" });

    //Validate that user owns list
    if (list.user.toString() !== req.user.id) {
      return res.status(401).send({ msg: "Unauthorized request" });
    }
    await List.findByIdAndRemove(req.params.id);
    res.send({ msg: "List removed" });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

module.exports = router;
