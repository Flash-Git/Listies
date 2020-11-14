import express from "express";
const router = express.Router();
import { check } from "express-validator";

import handleErrors from "./handleErrors";

import auth from "../../middleware/auth";

// Models
import Item from "../../models/Item";
import { Socket } from "socket.io";
import { IItem } from "models";

const ItemRoutes = getSocket => {
  // @route   GET api/items/:id
  // @desc    Get all list's items
  // @access  PRIVATE
  router.get("/:id", auth, async (req, res) => {
    try {
      // Get items by most recent
      const items = await Item.find({
        // user: req.user.id,
        list: req.params.id
      }).sort({
        date: -1
      });
      res.json(items);
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  });

  // @route   POST api/items/:id
  // @desc    Create an item
  // @access  PRIVATE
  router.post(
    "/:id",
    [auth, [check("item.name", "Please enter a name").not().isEmpty()]],
    async (req, res) => {
      if (handleErrors(req, res)) return;

      const { name } = req.body.item;
      const listId = req.body.listId;

      try {
        const newItem = new Item({
          name,
          user: req.user.id,
          list: req.params.id
        });

        const item: IItem = await newItem.save();

        // Emit
        getSocket().map((socket: Socket) =>
          socket.emit("addItem", item, listId)
        );

        res.json(item);
      } catch (e) {
        console.error(e.message);
        res.status(500).send({ msg: "Server Error" });
      }
    }
  );

  // @route   PUT api/items/:id
  // @desc    Update item
  // @access  PRIVATE
  router.put(
    "/:itemId",
    auth,
    [check("name", "Please enter a name").not().isEmpty()],
    async (req, res) => {
      if (handleErrors(req, res)) return;

      const { name, checked, importance, note } = req.body;

      type fields = {
        name?: string;
        checked?: boolean;
        importance?: number;
        note?: string;
      };
      // Build item object
      const itemFields: fields = {};
      if (name !== undefined) itemFields.name = name;
      if (checked !== undefined) itemFields.checked = checked;
      if (importance !== undefined) itemFields.importance = importance;
      if (note !== undefined) itemFields.note = note;

      try {
        let item = await Item.findById(req.params.itemId);
        if (!item) return res.status(404).send({ msg: "Item not found" });

        // Validate that user owns item
        // if (item.user.toString() !== req.user.id) {
        //   return res.status(401).send({ msg: "Unauthorized request" });
        // }

        item = await Item.findByIdAndUpdate(
          req.params.itemId,
          {
            $set: itemFields
          },
          {
            new: true // Create it if it doesn't exist
          }
        );

        // Emit
        getSocket().map(socket => socket.emit("editItem", item));

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
  router.delete("/:itemId", auth, async (req, res) => {
    try {
      const { itemId } = req.params;
      let item = await Item.findById(itemId);
      if (!item) return res.status(404).send({ msg: "Item not found" });

      // Validate that user owns item
      // if (item.user.toString() !== req.user.id) {
      //   return res.status(401).send({ msg: "Unauthorized request" });
      // }

      await Item.findByIdAndRemove(itemId);

      // Emit
      getSocket().map(socket => socket.emit("deleteItem", itemId));

      res.send({ msg: "Item removed" });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ msg: "Server Error" });
    }
  });

  return router;
};

export default ItemRoutes;
