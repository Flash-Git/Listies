import mongoose, { Schema } from "mongoose";
import { User } from ".";

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    default: Date.now,
  },
  accessIds: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model<User>("user", UserSchema);

export default User;
