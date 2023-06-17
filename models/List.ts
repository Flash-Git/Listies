import mongoose, { Schema } from "mongoose";
import { List } from ".";

const ListSchema: Schema<List> = new Schema({
  owner: {
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
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  date: {
    type: Number,
    default: Date.now,
  },
});

const List = mongoose.model<List>("list", ListSchema);

export default List;
