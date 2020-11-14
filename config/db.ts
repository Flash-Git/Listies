import mongoose from "mongoose";
import config from "config";

let db;
if (process.env.NODE_ENV === "production") {
  db = process.env.MONGO_URI;
} else {
  db = config.get("mongoURI");
}

const connectDB = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch(e => {
      console.error(e.message);
      process.exit(1);
    });
};

export default connectDB;
