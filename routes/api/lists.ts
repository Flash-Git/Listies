import { Router, Response } from "express";
import { check } from "express-validator";
import { Request } from "express-validator/src/base";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Socket } from "socket.io";

import handleErrors from "./handleErrors";

import auth from "../../middleware/auth";

// Models
import List from "../../models/List";
import User from "../../models/User";

import { List as IList } from "models";
import { GetFilteredSockets } from "server/server";

const router = Router();

const ListRoutes = (getSockets: GetFilteredSockets) => {
  // @route   GET api/lists
  // @desc    Get all user's lists
  // @access  PRIVATE
  router.get("/", auth, async (req: Request, res: Response) => {
    if (handleErrors(req, res)) return;

    try {
      // Get lists by most recent
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).send({ msg: "User not found" });
      const lists = await List.find({ accessId: { $in: user.accessIds } }); //.sort({date:-1});

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
    auth,
    [check("name", "Please enter a name").not().isEmpty()],
    async (req: Request, res: Response) => {
      if (handleErrors(req, res)) return;

      const { name, password }: IList = req.body;

      try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send({ msg: "User not found" });

        const accessId = crypto
          .createHash("sha256")
          .update(name + user.id.toString())
          .digest("hex");

        if (user.accessIds.includes(accessId))
          return res.status(403).send({ msg: "List with this accessId already exists" });

        const newList = new List({
          name,
          accessId,
          user: user.id,
        });
        if (password) {
          const salt = await bcrypt.genSalt(10);
          newList.password = await bcrypt.hash(password, salt);
        }

        await user.updateOne({
          $push: { accessIds: accessId },
        });

        const existingList = await List.findOne({ accessId });

        if (existingList) {
          // Emit
          getSockets(user.id).map((socket: Socket) => socket.emit("addList", existingList));

          return res.status(201).send(existingList);
        }

        const list = await newList.save();

        // Emit
        getSockets(user.id).map((socket: Socket) => socket.emit("addList", list));

        return res.status(201).send(list);
      } catch (e) {
        console.error(e.message);
        res.status(500).send({ msg: "Server Error" });
      }
    }
  );

  // @route   POST api/lists:accessId
  // @desc    Adds a list accessId to a user
  // @access  PRIVATE
  router.post("/:accessId", auth, async (req: Request, res: Response) => {
    if (handleErrors(req, res)) return;
  });

  // @route   DELETE api/lists
  // @desc    Delete a user's list
  // @access  PRIVATE
  router.delete("/:listId", auth, async (req: Request, res: Response) => {
    if (handleErrors(req, res)) return;
    const { listId }: { listId?: string } = req.params;

    try {
      const [user, list] = await Promise.all([User.findById(req.user.id), List.findById(listId)]);
      if (!user) return res.status(404).send({ msg: "User not found" });
      if (!list) return res.status(404).send({ msg: "List not found" });
      if (!user.accessIds.includes(list.accessId))
        return res.status(403).send({ msg: "Missing access id, permission denied" });

      // TODO Actual deletion does not yet exist
      // await list.remove();

      await user.updateOne({
        $pull: { accessIds: list.accessId },
      });

      // Emit
      getSockets(user.id).map((socket) => socket.emit("deleteList", list.id));

      res.send({ msg: "List removed" });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  });

  return router;
};
export default ListRoutes;
