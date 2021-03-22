import mongoose, { Schema } from "mongoose";
import { Item } from ".";

const ItemSchema: Schema = new Schema({
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
  note: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model<Item>("item", ItemSchema);

export default Item;
