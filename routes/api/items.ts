import { Router, Response } from "express";
import { check } from "express-validator";
import { Request } from "express-validator/src/base";
import { Socket } from "socket.io";

import handleErrors from "./handleErrors";

import auth from "../../middleware/auth";

// Models
import Item from "../../models/Item";
import List from "../../models/List";
import User from "../../models/User";

import { Item as IItem } from "models";
import { GetFilteredSockets } from "server/server";

const router = Router();

const ItemRoutes = (getSockets: GetFilteredSockets) => {
  // @route   GET api/items/:id
  // @desc    Get all list's items
  // @access  PRIVATE
  router.get("/:listId", auth, async (req: Request, res: Response) => {
    const { listId }: { listId?: string } = req.params;

    try {
      // Verification
      const [user, list] = await Promise.all([User.findById(req.user.id), List.findById(listId)]);
      if (!user) return res.status(404).send({ msg: "User not found" });
      if (!list) return res.status(404).send({ msg: "List not found" });
      if (!user.accessIds.includes(list.accessId))
        return res.status(403).send({ msg: "Missing access id, permission denied" });

      // Get items by most recent
      const items = await Item.find({
        list: listId,
      }).sort({
        date: -1,
      });
      res.json(items);
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  });

  // @route   POST api/items/:listId
  // @desc    Create an item
  // @access  PRIVATE
  router.post(
    "/:listId",
    auth,
    [check("item.name", "Please enter a name").not().isEmpty()],
    async (req: Request, res: Response) => {
      if (handleErrors(req, res)) return;
      const { listId }: { listId?: string } = req.params;
      const { name }: IItem = req.body.item;

      try {
        // Verification
        const [user, list] = await Promise.all([User.findById(req.user.id), List.findById(listId)]);
        if (!user) return res.status(404).send({ msg: "User not found" });
        if (!list) return res.status(404).send({ msg: "List not found" });
        if (!user.accessIds.includes(list.accessId))
          return res.status(403).send({ msg: "Missing access id, permission denied" });

        const newItem = new Item({
          name,
          user: user.id,
          list: listId,
        });

        const item = await newItem.save();

        // Emit
        getSockets(list.id).map((socket: Socket) => socket.emit("addItem", item, listId));

        res.json(item);
      } catch (e) {
        console.error(e.message);
        res.status(500).send({ msg: "Server Error" });
      }
    }
  );
  type Fields = {
    name?: string;
    checked?: boolean;
    importance?: number;
    marked?: boolean;
    note?: string;
  };

  // @route   PUT api/items/:listId
  // @desc    Update item
  // @access  PRIVATE
  router.put(
    "/:itemId",
    auth,
    [check("name", "Please enter a name").not().isEmpty()],
    async (req: Request, res: Response) => {
      if (handleErrors(req, res)) return;
      const { itemId }: { itemId?: string } = req.params;
      const { name, checked, importance, marked, note }: IItem = req.body;

      // Build item object
      const itemFields: Fields = {};
      if (name !== undefined) itemFields.name = name;
      if (checked !== undefined) itemFields.checked = checked;
      if (importance !== undefined) itemFields.importance = importance;
      if (marked !== undefined) itemFields.marked = marked;
      if (note !== undefined) itemFields.note = note;

      try {
        let item = await Item.findById(itemId);
        if (!item) return res.status(404).send({ msg: "Item not found" });

        // Verification
        const [user, list] = await Promise.all([
          User.findById(req.user.id),
          List.findById(item.list),
        ]);
        if (!user) return res.status(404).send({ msg: "User not found" });
        if (!list) return res.status(404).send({ msg: "List not found" });
        if (!user.accessIds.includes(list.accessId))
          return res.status(403).send({ msg: "Missing access id, permission denied" });

        item = await Item.findByIdAndUpdate(
          itemId,
          {
            $set: itemFields,
          },
          {
            new: true, // Create it if it doesn't exist
          }
        );

        // Emit
        getSockets(list.id).map((socket) => socket.emit("editItem", item));

        res.json(item);
      } catch (e) {
        console.error(e.message);
        res.status(500).send({ msg: "Server Error" });
      }
    }
  );

  // @route   DELETE api/lists/:itemId
  // @desc    Delete a user's list
  // @access  PRIVATE
  router.delete("/:itemId", auth, async (req: Request, res: Response) => {
    const { itemId }: { itemId?: string } = req.params;

    try {
      const item = await Item.findById(itemId);
      if (!item) return res.status(404).send({ msg: "Item not found" });

      // Verification
      const [user, list] = await Promise.all([
        User.findById(req.user.id),
        List.findById(item.list),
      ]);
      if (!user) return res.status(404).send({ msg: "User not found" });
      if (!list) return res.status(404).send({ msg: "List not found" });
      if (!user.accessIds.includes(list.accessId))
        return res.status(403).send({ msg: "Missing access id, permission denied" });

      await Item.findByIdAndRemove(itemId);

      // Emit
      getSockets(list.id).map((socket) => socket.emit("deleteItem", itemId));

      res.send({ msg: "Item removed" });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  });

  return router;
};

export default ItemRoutes;
