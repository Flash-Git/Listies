const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create scema
const ListSchema = new Schema({
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

module.exports = List = mongoose.model("list", ListSchema);
