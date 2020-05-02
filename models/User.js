const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    username: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
