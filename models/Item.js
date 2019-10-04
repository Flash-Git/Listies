const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create scema
const ItemSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lists"
  },
  name: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Item = mongoose.model("item", ItemSchema);
