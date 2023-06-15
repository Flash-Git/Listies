import mongoose, { Schema } from "mongoose";
import { Item } from ".";

const ItemSchema: Schema<Item> = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lists",
  },
  name: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  importance: {
    type: Number,
    default: 0,
  },
  marked: {
    type: Boolean,
    default: undefined,
  },
  note: {
    type: String,
    default: "",
  },
  date: {
    type: Number,
    default: Date.now,
  },
});

const Item = mongoose.model<Item>("item", ItemSchema);

export default Item;
