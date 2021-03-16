import mongoose, { Schema } from "mongoose";
import { IUser } from ".";

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  accessCodes: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model<IUser>("user", UserSchema);

export default User;
