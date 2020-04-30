express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const handleErrors = require("./handleErrors");

const auth = require("../../middleware/auth");

// Models
const List = require("../../models/List");
const User = require("../../models/User");

// @route   GET api/lists
// @desc    Get all user's lists
// @access  PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    //Get lists by most recent
    const user = await User.findById(req.user.id);
    let lists = await Promise.all(
      user.accessCodes.map(accessCode => {
        return List.findOne({ accessCode }).sort({
          date: -1
        });
      })
    );

    lists = lists.filter(list => list !== null);
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
  [auth, [check("name", "Please enter a name").not().isEmpty()]],
  async (req, res) => {
    if (handleErrors(req, res)) return;

    const { name, accessCode } = req.body;
    try {
      // Check if list exists

      const existingList =
        accessCode === "" ? "" : await List.findOne({ accessCode });

      if (existingList) {
        await User.findById(req.user.id).updateOne({
          $push: { accessCodes: existingList.accessCode }
        });
        res.json(existingList);

        return;
      }

      const newList = new List({
        name,
        accessCode: accessCode,
        user: req.user.id
      });
      await User.findById(req.user.id).updateOne({
        $push: { accessCodes: accessCode }
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
    // let list = await List.findById(req.params.id);
    // if (!list) return res.status(404).send({ msg: "List not found" });

    //Validate that user owns list
    // if (list.user.toString() !== req.user.id) {
    //   return res.status(401).send({ msg: "Unauthorized request" });
    // }
    // await List.findByIdAndRemove(req.params.id);

    const accessCode = req.params.id;

    if (!accessCode) {
      await List.findByIdAndRemove(accessCode);
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { accessCodes: accessCode }
      });
    }

    res.send({ msg: "List removed" });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

module.exports = router;
