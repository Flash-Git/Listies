import { Router, Response } from "express";
import { check } from "express-validator";
import { Request } from "express-validator/src/base";

import handleErrors from "./handleErrors";

import auth from "../../middleware/auth";

// Models
import List from "../../models/List";
import User from "../../models/User";

import { List as IList } from "models";

const router = Router();

// @route   GET api/lists
// @desc    Get all user's lists
// @access  PRIVATE
router.get("/", auth, async (req: Request, res: Response) => {
  if (handleErrors(req, res)) return;

  try {
    // Get lists by most recent
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send({ msg: "User not found" });
    let lists = await Promise.all(
      user.accessCodes.map((accessCode) => {
        return List.findOne({ accessCode }).sort({
          date: -1,
        });
      })
    );
    const personalLists = await List.find({ user: req.user.id });

    res.json([...lists.filter((list) => list), ...personalLists]);
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
  auth,
  [check("name", "Please enter a name").not().isEmpty()],
  async (req: Request, res: Response) => {
    if (handleErrors(req, res)) return;

    const { name, accessCode }: IList = req.body;

    try {
      const newList = new List({
        name,
        accessCode,
        user: req.user.id,
      });

      const getPublicList = async (accessCode) => {
        if (accessCode === "") return null;
        return await List.findOne({ accessCode });
      };

      const publicList = await getPublicList(accessCode);

      // Existing public list
      if (publicList) {
        res.json(publicList);
        await (await User.findById(req.user.id)).updateOne({
          $push: { accessCodes: publicList.accessCode },
        });

        await List.findByIdAndUpdate(publicList.id, {
          count: ++publicList.count,
        });
        return;
      }

      const list = await newList.save();
      res.json(list);

      // New private list
      if (accessCode === "") return;

      // New public list
      await (await User.findById(req.user.id)).updateOne({
        $push: { accessCodes: accessCode },
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
router.delete("/:listId", auth, async (req: Request, res: Response) => {
  if (handleErrors(req, res)) return;
  const { listId }: { listId?: string } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).send({ msg: "List not found" });

    const accessCode = list.accessCode;

    // Local list
    if (!accessCode || list.count - 1 < 1) {
      await List.findByIdAndRemove(listId);
      // Shared list
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { accessCodes: accessCode },
      });
      await List.findByIdAndUpdate(listId, { count: --list.count });
    }

    res.send({ msg: "List removed" });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ msg: "Server Error" });
  }
});

export default router;
