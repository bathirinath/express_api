const mongoose = require("mongoose");

const Userdetail = mongoose.model(
  "Userdetail",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })
);

module.exports = Userdetail;
