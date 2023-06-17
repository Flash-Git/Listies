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

      // List.updateMany({ accessId: { $in: user.accessIds },  }, ) // Definitely a better query possible

      // Verify that these lists all contain the user in their user list
      lists
        .filter((list) => !list.users.includes(user._id))
        .forEach((list) => {
          list.updateOne({
            $push: { users: user._id },
          });
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
          .update(name + user._id)
          .digest("hex");

        let list = await List.findOne({ accessId });

        // return res.status(403).send({ msg: "User already has a List with this id" });
        if (user.accessIds.includes(accessId)) {
          if (list) {
            if (list.users.includes(user._id)) return res.status(202).send(list);
          } else {
          }
        } else {
          await user.updateOne({
            $push: { accessIds: accessId },
          });

          if (list) return res.status(202).send(list);
        }

        const newList = new List({
          owner: user._id,
          name,
          accessId,
          users: [user._id],
        });

        if (password) {
          const salt = await bcrypt.genSalt(10);
          newList.password = await bcrypt.hash(password, salt);
        } else {
          newList.private = true;
        }

        await user.updateOne({
          $push: { accessIds: accessId },
        });

        // const existingList = await List.findOne({ accessId });
        // if (existingList) {
        //   // Emit
        //   getSockets(user._id).map((socket: Socket) => socket.emit("addList", existingList));
        //   return res.status(201).send(existingList);
        // }

        list = await newList.save();

        // Emit
        getSockets(user._id).map((socket: Socket) => socket.emit("addList", list));

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
    const { accessId }: { accessId?: string } = req.params;
    const { password }: IList = await req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).send({ msg: "User not found" });

      const list = await List.findOne({ accessId });
      if (!list || list.private) return res.status(404).send({ msg: "List not found" });

      // return res.status(403).send({ msg: "User already has a List with this id" });
      if (user.accessIds.includes(accessId)) return res.status(202).send(list);

      if (list.password) {
        const isMatch = await bcrypt.compare(password, list.password);
        if (!isMatch) return res.status(400).send({ msg: "Invalid credentials" });
      } else {
        return res.status(400).send({ msg: "List has no password" }); //todo
      }

      await list.updateOne({
        $push: { users: user._id },
      });

      await user.updateOne({
        $push: { accessIds: accessId },
      });

      // Emit
      getSockets(user._id).map((socket: Socket) => socket.emit("addList", list));

      return res.status(201).send(list);
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
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

      await Promise.all([
        user.updateOne({
          $pull: { accessIds: list.accessId },
        }),
        list.updateOne({
          $pull: { users: user._id },
        }),
      ]);

      if (list.users.length === 1) await list.deleteOne();

      // Emit
      getSockets(user._id).map((socket) => socket.emit("deleteList", list.id));

      res.send({ msg: "List removed" });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  });

  return router;
};

export default ListRoutes;
