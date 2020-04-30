const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create scema
const ListSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  accessCode: {
    type: String
    // required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = List = mongoose.model("list", ListSchema);
