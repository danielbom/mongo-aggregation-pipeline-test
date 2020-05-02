const mongoose = require("mongoose");

const People = mongoose.Schema(
  {
    name: String,
    age: Number,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("People", People);
