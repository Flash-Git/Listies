import mongoose, { Schema } from "mongoose";
import { List } from ".";

const ListSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  accessId: {
    type: String,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const List = mongoose.model<List>("list", ListSchema);

export default List;
