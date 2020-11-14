import mongoose, { Schema } from "mongoose";
import { IList } from ".";

const ListSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  accessCode: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  count: {
    type: Number,
    default: 1
  }
});

const List = mongoose.model<IList>("list", ListSchema);

export default List;
