import mongoose from "mongoose";
import config from "config";

const connectDB = async () => {
  const db: string =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI
      : config.get("mongoURI");

  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

export default connectDB;
