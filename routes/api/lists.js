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
    let personalLists = await List.find({ user: req.user.id });

    lists = lists.filter(list => list !== null);
    res.json([...lists, ...personalLists]);
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
      const newList = new List({
        name,
        accessCode: accessCode,
        user: req.user.id
      });

      const checkList = async accessCode => {
        if (accessCode === "") return null;
        const existingList = await List.findOne({ accessCode });
        return existingList;
      };

      const exists = await checkList(accessCode);

      // Existing public list
      if (exists) {
        res.json(exists);
        await User.findById(req.user.id).updateOne({
          $push: { accessCodes: exists.accessCode }
        });
        return;
      }

      const list = await newList.save();
      res.json(list);

      // New private list
      if (accessCode === "") return;

      // New public list
      await User.findById(req.user.id).updateOne({
        $push: { accessCodes: accessCode }
      });
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
    const listId = req.params.id;

    const list = await List.findById(listId);
    if (!list) return res.status(404).send({ msg: "List not found" });

    const accessCode = list.accessCode;
    // Local list
    if (!accessCode) {
      //Validate that user owns list
      if (list.user.toString() !== req.user.id)
        return res.status(401).send({ msg: "Unauthorized request" });

      await List.findByIdAndRemove(listId);
      // Shared list
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
